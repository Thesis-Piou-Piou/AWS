/**
 * This Lambda function estimates the value of π (pi) using the Monte Carlo method.
 * It receives an HTTP POST request via API Gateway with a JSON body containing
 * a positive integer `n`, representing the number of random points to generate.
 *
 * The algorithm simulates throwing `n` random points into a 1x1 square and counts
 * how many fall inside the inscribed quarter-circle. It uses the ratio of these
 * points to estimate the value of π.
 *
 * Input:
 * {
 *   "n": 100000  // (required) number of random points
 * }
 *
 * Success Response (HTTP 200):
 * {
 *   "result": 3.14159,           // estimated value of π
 *   "execution": "27.158798"         // execution time in milliseconds
 * }
 *
 * Error Responses (HTTP 400):
 * - If input JSON is invalid or missing
 * - If `n` is not a positive number
 *
 */

export const handler = async (event) => {
  const start = performance.now();

  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }
  
  const { n } = body || {};

  if (isNaN(n) || n <= 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "n must be a positive number" }),
    };
  }

  const result = estimatePi(n);
  const executionDuration = performance.now() - start;

  return {
    statusCode: 200,
    body: JSON.stringify({
      result,
      execution: executionDuration.toFixed(6)+ " ms",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

function estimatePi(n) {
  let inside = 0;

  for (let i = 0; i < n; i++) {
    const x = Math.random();
    const y = Math.random();

    if (x * x + y * y <= 1) {
      inside++;
    }
  }

  return 4 * (inside / n);
}

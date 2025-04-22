/**
 * AWS Lambda function to perform matrix multiplication.
 *
 * This function receives two 2D matrices in the request body, performs matrix multiplication,
 * and returns the result as a JSON response.
 * 
 * The function is triggered by an HTTP POST request, where the matrices A and B are provided
 * in the request body as JSON objects.
 * 
 * Metrics such as execution time are logged for performance monitoring.
 *
 * Response:
 * The function returns a JSON object containing the multiplication result along with the execution time.
 * 
 * Example input (POST body):
 * {
 *   "matrixA": [[1, 2], [3, 4]],
 *   "matrixB": [[5, 6], [7, 8]]
 * }
 */

import { performance } from 'perf_hooks';

// Matrix multiplication function
export const handler = async (event) => {
  const start = performance.now();  // Start measuring execution time

  // Extract matrices from the event body
  let matrixA = JSON.parse(event.body).matrixA;
  let matrixB = JSON.parse(event.body).matrixB;

  // Check if the matrices can be multiplied (columns of A must match rows of B)
  if (matrixA[0].length !== matrixB.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Incompatible matrices for multiplication' }),
    };
  }

  // Perform matrix multiplication
  const resultMatrix = multiplyMatrices(matrixA, matrixB);

  const end = performance.now();  // End measuring execution time

  // Calculate execution duration
  const execution = end - start;

  // Return the result and metrics
  return {
    statusCode: 200,
    body: JSON.stringify({
      resultMatrix,
      execution: execution.toFixed(6)+ " ms",
    }),
  };
};

// Function to multiply two matrices
const multiplyMatrices = (A, B) => {
  const result = [];
  
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      result[i][j] = 0;
      for (let k = 0; k < A[0].length; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }

  return result;
};

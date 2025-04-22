/**
 * AWS Lambda function to return a list of EU countries and their ISO codes.
 * This function is triggered via an HTTP request (e.g., GET /countries).
 * It responds with static country data and includes the execution time.
 */
import { performance } from "perf_hooks";

export const handler = async (event) => {
  const start = performance.now();

  const euCountries = [
    { name: "Austria", code: "AT" },
    { name: "Belgium", code: "BE" },
    { name: "Bulgaria", code: "BG" },
    { name: "Croatia", code: "HR" },
    { name: "Cyprus", code: "CY" },
    { name: "Czech Republic", code: "CZ" },
    { name: "Denmark", code: "DK" },
    { name: "Estonia", code: "EE" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "Germany", code: "DE" },
    { name: "Greece", code: "GR" },
    { name: "Hungary", code: "HU" },
    { name: "Ireland", code: "IE" },
    { name: "Italy", code: "IT" },
    { name: "Latvia", code: "LV" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Malta", code: "MT" },
    { name: "Netherlands", code: "NL" },
    { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Romania", code: "RO" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Spain", code: "ES" },
    { name: "Sweden", code: "SE" }
  ];

  const execution = performance.now() - start;

  return {
    statusCode: 200,
    body: JSON.stringify({
      countries: euCountries,
      execution: execution.toFixed(6) + " ms"
    }),
    headers: {
      "Content-Type": "application/json"
    },
  };
};

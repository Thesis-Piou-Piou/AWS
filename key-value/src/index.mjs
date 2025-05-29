import { DynamoDBClient, PutItemCommand, GetItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "eu-north-1" });
const TABLE_NAME = "KeyValueStore";

export const handler = async (event) => {
  const start = performance.now();

  let statusCode = 200;
  let body = "";
  
  const { httpMethod, queryStringParameters, body: requestBody } = event;

  try {
    // Common params
    const keyParam = queryStringParameters?.key;

    switch (httpMethod) {
      case "POST": {
        const { userid, value } = JSON.parse(requestBody);

        if (!userid || !value) {
          throw new Error("Missing userid or value in the request.");
        }

        // Store key-value in DynamoDB
        const params = {
          TableName: TABLE_NAME,
          Item: {
            key: { S: userid },
            value: { S: value },
          },
        };
        await client.send(new PutItemCommand(params));
        body = "Stored successfully";
        break;
      }

      case "GET": {
        if (keyParam) {
          const params = {
            TableName: TABLE_NAME,
            Key: { key: { S: keyParam } },
          };
          const data = await client.send(new GetItemCommand(params));
          if (data.Item) {
            body = data.Item.value.S;
          } else {
            statusCode = 404;
            body = "Key not found";
          }
        } else {
          // If no key, return all keys (optionally)
          // This would require a Scan or Query operation in DynamoDB, but scanning all keys is inefficient
          statusCode = 400;
          body = "Key parameter is required";
        }
        break;
      }

      case "DELETE": {
        if (keyParam) {
          const params = {
            TableName: TABLE_NAME,
            Key: { key: { S: keyParam } },
          };
          await client.send(new DeleteItemCommand(params));
          body = "Deleted successfully";
        } else {
          statusCode = 400;
          body = "Key parameter is required";
        }
        break;
      }

      case "HEAD": {
        if (keyParam) {
          const params = {
            TableName: TABLE_NAME,
            Key: { key: { S: keyParam } },
          };
          const data = await client.send(new GetItemCommand(params));
          statusCode = data.Item ? 200 : 404;
        } else {
          statusCode = 400;
          body = "Key parameter is required";
        }
        break;
      }

      default:
        statusCode = 405;  // Method Not Allowed
        body = "Method Not Allowed";
    }
  } catch (error) {
    console.error("DynamoDB Error:", error);
    statusCode = 500;
    body = `Error: ${error.message}`;
  }

  const executionTime = (performance.now() - start).toFixed(6);

  return {
    statusCode,
    body: JSON.stringify({
      status: statusCode,
      body,
      execution: executionTime,
    }),
  };
};

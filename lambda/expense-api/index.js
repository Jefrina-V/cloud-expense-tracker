import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "node:crypto";

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "ap-south-1" });
const db = DynamoDBDocumentClient.from(client);
const TABLE = process.env.TABLE_NAME || "StudentExpenses";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS"
};

function response(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function userIdFrom(event) {
  return event?.requestContext?.authorizer?.jwt?.claims?.sub
    || event?.requestContext?.authorizer?.claims?.sub
    || event?.requestContext?.authorizer?.principalId;
}

export const handler = async (event) => {
  try {
    if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") return response(204, {});
    const userId = userIdFrom(event);
    if (!userId) return response(401, { message: "Unauthorized" });

    const method = event.requestContext?.http?.method || event.httpMethod;
    const pathParameters = event.pathParameters || {};

    if (method === "GET") {
      const result = await db.send(new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId }
      }));
      return response(200, result.Items || []);
    }

    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      if (!body.expenseName || !Number(body.amount) || !body.category || !body.date) {
        return response(400, { message: "expenseName, amount, category and date are required." });
      }
      const item = {
        userId,
        expenseId: crypto.randomUUID(),
        expenseName: String(body.expenseName).trim(),
        amount: Number(body.amount),
        category: String(body.category),
        date: String(body.date),
        description: String(body.description || "").trim(),
        createdAt: new Date().toISOString()
      };
      await db.send(new PutCommand({ TableName: TABLE, Item: item }));
      return response(201, item);
    }

    if (method === "DELETE") {
      const expenseId = pathParameters.expenseId;
      if (!expenseId) return response(400, { message: "expenseId is required." });
      await db.send(new DeleteCommand({ TableName: TABLE, Key: { userId, expenseId } }));
      return response(200, { message: "Expense deleted." });
    }

    return response(404, { message: "Route not found." });
  } catch (error) {
    console.error(error);
    return response(500, { message: "Internal server error." });
  }
};
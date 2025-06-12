"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const quoteId = event.pathParameters.id;
  const data = JSON.parse(event.body);

  // Lista de campos permitidos para actualizar
  const allowedFields = [
    "clientId",
    "vendorId",
    "venueId",
    "status", // pending, approved, rejected
    "date",
    "totalPrice",
    "notes",
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No valid fields to update." }),
    };
  }

  updates.updatedAt = new Date().toISOString();

  const UpdateExpression = `SET ${Object.keys(updates)
    .map((key) => `#${key} = :${key}`)
    .join(", ")}`;
  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  for (const key of Object.keys(updates)) {
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = updates[key];
  }

  const params = {
    TableName: process.env.QUOTES_TABLE,
    Key: { id: quoteId },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression: "attribute_exists(id)", // 👈 Esto evita que se cree si no existe
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Quote updated successfully",
        quote: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error updating quote:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating quote" }),
    };
  }
};

"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const userId = event.pathParameters.id;
  const data = JSON.parse(event.body);

  // Lista de campos permitidos para actualizar
  const allowedFields = [
    "email",
    "fullName",
    "role",
    "phoneNumber",
    "profilePhotoUrl",
    "passwordHash",
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
    TableName: process.env.USERS_TABLE,
    Key: { id: userId },
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
        message: "User updated successfully",
        user: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.code === "ConditionalCheckFailedException") {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `User with ID ${userId} not found.` }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating user" }),
    };
  }
};

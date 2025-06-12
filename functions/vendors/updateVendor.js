"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const vendorId = event.pathParameters.id;
  const data = JSON.parse(event.body);

  if (!vendorId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing vendor ID in path" }),
    };
  }

  const getParams = {
    TableName: process.env.VENDORS_TABLE,
    Key: { id: vendorId },
  };

  try {
    const result = await dynamoDb.get(getParams).promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Vendor with ID ${vendorId} not found.`,
        }),
      };
    }

    const allowedFields = [
      "companyName",
      "contactName",
      "email",
      "phone",
      "services",
    ];
    const updateExpressions = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    for (const field of allowedFields) {
      if (field in data) {
        updateExpressions.push(`#${field} = :${field}`);
        expressionAttributeValues[`:${field}`] = data[field];
        expressionAttributeNames[`#${field}`] = field;
      }
    }

    if (updateExpressions.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No valid fields to update." }),
      };
    }

    // Agregar campo updatedAt
    updateExpressions.push("#updatedAt = :updatedAt");
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();
    expressionAttributeNames["#updatedAt"] = "updatedAt";

    const updateParams = {
      TableName: process.env.VENDORS_TABLE,
      Key: { id: vendorId },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ConditionExpression: "attribute_exists(id)", // 👈 Esto evita que se cree si no existe
      ReturnValues: "ALL_NEW",
    };

    const updated = await dynamoDb.update(updateParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Vendor updated successfully",
        vendor: updated.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error updating vendor:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error updating vendor",
        error: error.message,
      }),
    };
  }
};

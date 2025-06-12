"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const venueId = event.pathParameters.id;
  const data = JSON.parse(event.body);

  const tableName = process.env.VENUES_TABLE;

  try {
    // Verificar si el venue existe
    const existingVenue = await dynamoDb
      .get({
        TableName: tableName,
        Key: { id: venueId },
      })
      .promise();

    if (!existingVenue.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Venue with ID ${venueId} not found.`,
        }),
      };
    }

    // Preparar campos actualizables
    const allowedFields = [
      "hostId",
      "name",
      "description",
      "address",
      "city",
      "state",
      "country",
      "latitude",
      "longitude",
      "capacity",
      "pricePerHour",
      "rules",
      "amenities",
      "photosUrls",
      "availabilityCalendar",
    ];

    const updateExpressionParts = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        updateExpressionParts.push(`#${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = data[key];
        expressionAttributeNames[`#${key}`] = key;
      }
    }

    // Asegurar que hay al menos un campo a actualizar
    if (updateExpressionParts.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "No valid fields provided for update.",
        }),
      };
    }

    // Agregar campo updatedAt
    updateExpressionParts.push("#updatedAt = :updatedAt");
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();
    expressionAttributeNames["#updatedAt"] = "updatedAt";

    const updateParams = {
      TableName: tableName,
      Key: { id: venueId },
      UpdateExpression: "SET " + updateExpressionParts.join(", "),
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ConditionExpression: "attribute_exists(id)", // 👈 Esto evita que se cree si no existe
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(updateParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Venue updated successfully.",
        venue: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error updating venue:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error updating venue",
        error: error.message,
      }),
    };
  }
};

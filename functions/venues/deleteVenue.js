"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const venueId = event.pathParameters.id;

  const getParams = {
    TableName: process.env.VENUES_TABLE,
    Key: { id: venueId },
  };

  try {
    // Verificar si el venue existe
    const result = await dynamoDb.get(getParams).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Venue with ID ${venueId} not found.`,
        }),
      };
    }

    // Si existe, eliminarlo
    await dynamoDb.delete(getParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Venue with ID ${venueId} deleted successfully.`,
      }),
    };
  } catch (error) {
    console.error("Error deleting venue:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error deleting venue",
        error: error.message,
      }),
    };
  }
};

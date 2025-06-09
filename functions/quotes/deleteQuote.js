"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const quoteId = event.pathParameters.id;

  const params = {
    TableName: process.env.QUOTES_TABLE,
    Key: {
      id: quoteId, // Asegúrate que la clave primaria se llame 'id' en tu tabla
    },
  };

  try {
    // Verificar si el quote existe
    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Quote with ID ${quoteId} not found.`,
        }),
      };
    }

    await dynamoDb.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Quote with ID ${quoteId} deleted successfully.`,
      }),
    };
  } catch (error) {
    console.error("Error deleting quote:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error deleting quote",
        error: error.message,
      }),
    };
  }
};

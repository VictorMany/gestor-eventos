"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const userId = event.pathParameters.id;

  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: userId, // Asegúrate que la clave primaria se llame 'id' en tu tabla
    },
  };

  try {
    // Verificar si el user existe
    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `User with ID ${userId} not found.`,
        }),
      };
    }

    await dynamoDb.delete(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User with ID ${userId} deleted successfully.`,
      }),
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error deleting user",
        error: error.message,
      }),
    };
  }
};

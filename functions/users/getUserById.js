"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const userId = event.pathParameters.id;

  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      id: userId, // asegúrate que sea el mismo nombre que usaste en tu tabla
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `User with ID ${userId} not found` }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error getting user" }),
    };
  }
};

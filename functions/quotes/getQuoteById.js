"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const quoteId = event.pathParameters.id;

  const params = {
    TableName: process.env.QUOTES_TABLE,
    Key: {
      id: quoteId,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Quote with ID ${quoteId} not found`,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error fetching quote by ID:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error fetching quote",
        error: error.message,
      }),
    };
  }
};

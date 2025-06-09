"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async () => {
  const params = {
    TableName: process.env.VENDORS_TABLE,
  };

  try {
    const result = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        vendors: result.Items,
      }),
    };
  } catch (error) {
    console.error("Error listing vendors:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving vendors",
        error: error.message,
      }),
    };
  }
};

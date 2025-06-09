"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const vendorId = event.pathParameters.id;

  const params = {
    TableName: process.env.VENDORS_TABLE,
    Key: { id: vendorId },
  };

  try {
    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Vendor with ID ${vendorId} not found.`,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error retrieving vendor:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error retrieving vendor",
        error: error.message,
      }),
    };
  }
};

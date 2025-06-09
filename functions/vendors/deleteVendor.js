"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const vendorId = event.pathParameters.id;

  const getParams = {
    TableName: process.env.VENDORS_TABLE,
    Key: { id: vendorId },
  };

  try {
    // Verificar si el vendor existe
    const result = await dynamoDb.get(getParams).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Vendor with ID ${vendorId} not found.`,
        }),
      };
    }

    const deleteParams = {
      TableName: process.env.VENDORS_TABLE,
      Key: { id: vendorId },
    };

    await dynamoDb.delete(deleteParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Vendor with ID ${vendorId} deleted successfully.`,
      }),
    };
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error deleting vendor",
        error: error.message,
      }),
    };
  }
};

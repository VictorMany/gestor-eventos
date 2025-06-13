"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const serviceId = event.pathParameters.id;

  const params = {
    TableName: process.env.VENDOR_SERVICES_TABLE,
    Key: { id: serviceId },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Service deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting service:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error deleting service", error }),
    };
  }
};

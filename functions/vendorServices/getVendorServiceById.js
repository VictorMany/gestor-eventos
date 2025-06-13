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
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Service not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error fetching service:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error fetching service", error }),
    };
  }
};

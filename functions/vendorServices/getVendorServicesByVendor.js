"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const vendorId = event.pathParameters.vendorId;

  const params = {
    TableName: process.env.VENDOR_SERVICES_TABLE,
    IndexName: "vendorId-index",
    KeyConditionExpression: "vendorId = :vendorId",
    ExpressionAttributeValues: {
      ":vendorId": vendorId,
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error("Error querying services:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error querying services", error }),
    };
  }
};

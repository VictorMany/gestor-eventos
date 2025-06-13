"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const serviceId = event.pathParameters.id;
    const data = JSON.parse(event.body);
    const timestamp = new Date().toISOString();

    const updateParams = {
      TableName: process.env.VENDOR_SERVICES_TABLE,
      Key: { id: serviceId },
      UpdateExpression:
        "set title = :t, description = :d, price = :p, itemsIncluded = :i, durationHours = :h, photosUrls = :u, updatedAt = :uAt",
      ExpressionAttributeValues: {
        ":t": data.title,
        ":d": data.description,
        ":p": data.price,
        ":i": data.itemsIncluded || [],
        ":h": data.durationHours || null,
        ":u": data.photosUrls || [],
        ":uAt": timestamp,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(updateParams).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Service updated",
        service: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error updating service:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating service", error }),
    };
  }
};

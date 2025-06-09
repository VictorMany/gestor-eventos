"use strict";

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const requiredFields = [
      "clientId",
      "vendorId",
      "eventDate",
      "servicesRequested",
      "estimatedCost",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Missing required field: ${field}` }),
        };
      }
    }

    const timestamp = new Date().toISOString();
    const quoteId = uuidv4();

    const newQuote = {
      id: quoteId,
      clientId: data.clientId,
      vendorId: data.vendorId,
      eventDate: data.eventDate, // ISO 8601 string e.g., "2025-08-10"
      servicesRequested: data.servicesRequested, // array e.g., ["catering", "sound"]
      estimatedCost: data.estimatedCost,
      notes: data.notes || null,
      status: "pending", // initial status
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const params = {
      TableName: process.env.QUOTES_TABLE,
      Item: newQuote,
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Quote created successfully",
        quote: newQuote,
      }),
    };
  } catch (error) {
    console.error("Error creating quote:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating quote",
        error: error.message,
      }),
    };
  }
};

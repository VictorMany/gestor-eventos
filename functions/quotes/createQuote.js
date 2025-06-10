"use strict";

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getItemById = async (tableName, id) => {
  const params = { TableName: tableName, Key: { id } };
  const result = await dynamoDb.get(params).promise();
  return result.Item;
};

module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const requiredFields = [
      "clientId",
      "vendorId",
      "eventDate",
      "servicesRequested",
      "estimatedCost",
      "requiresVenue",
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Missing required field: ${field}` }),
        };
      }
    }

    if (data.requiresVenue && !data.venueId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required field: venueId when requiresVenue is true",
        }),
      };
    }

    // Lanzar consultas en paralelo
    const clientPromise = getItemById(process.env.USERS_TABLE, data.clientId);
    const vendorPromise = getItemById(process.env.VENDORS_TABLE, data.vendorId);
    let venuePromise = null;
    if (data.requiresVenue) {
      venuePromise = getItemById(process.env.VENUES_TABLE, data.venueId);
    }

    const [client, vendor, venue] = await Promise.all([
      clientPromise,
      vendorPromise,
      venuePromise,
    ]);

    if (!client) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Client with id ${data.clientId} not found`,
        }),
      };
    }
    if (!vendor) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Vendor with id ${data.vendorId} not found`,
        }),
      };
    }
    if (data.requiresVenue && !venue) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Venue with id ${data.venueId} not found`,
        }),
      };
    }

    const timestamp = new Date().toISOString();
    const quoteId = uuidv4();

    const newQuote = {
      id: quoteId,
      clientId: data.clientId,
      vendorId: data.vendorId,
      eventDate: data.eventDate,
      servicesRequested: data.servicesRequested,
      estimatedCost: data.estimatedCost,
      requiresVenue: data.requiresVenue,
      venueId: data.requiresVenue ? data.venueId : null,
      notes: data.notes || null,
      status: "pending",
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

"use strict";

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const requiredFields = ["vendorId", "title", "description", "price"];

    for (const field of requiredFields) {
      if (!data[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `Missing required field: ${field}` }),
        };
      }
    }

    const timestamp = new Date().toISOString();
    const id = uuidv4();

    const newService = {
      id,
      vendorId: data.vendorId,
      title: data.title,
      description: data.description,
      price: data.price,
      itemsIncluded: data.itemsIncluded || [],
      durationHours: data.durationHours || null,
      photosUrls: data.photosUrls || [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const params = {
      TableName: process.env.VENDOR_SERVICES_TABLE,
      Item: newService,
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Vendor service created successfully",
        service: newService,
      }),
    };
  } catch (error) {
    console.error("Error creating vendor service:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating vendor service", error }),
    };
  }
};

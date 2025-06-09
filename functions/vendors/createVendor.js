"use strict";

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const requiredFields = [
      "userId",
      "name",
      "category",
      "description",
      "contactEmail",
      "phoneNumber",
      "location",
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
    const id = uuidv4();

    const newVendor = {
      id,
      userId: data.userId,
      name: data.name,
      category: data.category,
      description: data.description,
      contactEmail: data.contactEmail,
      phoneNumber: data.phoneNumber,
      location: data.location,
      pricingDetails: data.pricingDetails || null,
      photosUrls: data.photosUrls || [],
      rating: data.rating || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const params = {
      TableName: process.env.VENDORS_TABLE,
      Item: newVendor,
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Vendor created successfully",
        vendor: newVendor,
      }),
    };
  } catch (error) {
    console.error("Error creating vendor:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating vendor", error: error }),
    };
  }
};

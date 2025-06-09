"use strict";

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const requiredFields = [
      "hostId",
      "name",
      "address",
      "city",
      "state",
      "country",
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

    const newVenue = {
      id,
      hostId: data.hostId,
      name: data.name,
      description: data.description || null,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      capacity: data.capacity || null,
      pricePerHour: data.pricePerHour || null,
      rules: data.rules || [],
      amenities: data.amenities || [],
      photosUrls: data.photosUrls || [],
      availabilityCalendar: data.availabilityCalendar || [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const params = {
      TableName: process.env.VENUES_TABLE,
      Item: newVenue,
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Venue created successfully",
        venue: newVenue,
      }),
    };
  } catch (error) {
    console.error("Error creating venue:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating venue" }),
    };
  }
};

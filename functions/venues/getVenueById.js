"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const venueId = event.pathParameters.id;

  const params = {
    TableName: process.env.VENUES_TABLE,
    Key: {
      id: venueId, // asegúrate que sea el mismo nombre que usaste en tu tabla
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `Venue with ID ${venueId} not found` }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error getting venue:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error getting venue", error }),
    };
  }
};

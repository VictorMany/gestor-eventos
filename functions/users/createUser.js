("use strict");

const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
// instancia de Dynamo
const dynamoDb = new AWS.DynamoDB.DocumentClient();

//handler para crear un nuevo usuario
module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const requiredFields = ["email", "passwordHash", "fullName", "role"];
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

    const newUser = {
      id,
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      role: data.role, // host, client, vendor, admin
      phoneNumber: data.phoneNumber || null,
      profilePhotoUrl: data.profilePhotoUrl || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const params = {
      TableName: process.env.USERS_TABLE,
      Item: newUser,
    };

    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User created successfully",
        user: newUser,
      }),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating user", error }),
    };
  }
};

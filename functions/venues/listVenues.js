const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const tableName = process.env.VENUES_TABLE;

  const params = {
    TableName: tableName,
  };

  try {
    const data = await dynamodb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Venues retrieved successfully",
        data: data.Items,
      }),
    };
  } catch (error) {
    console.error("Error listing venues:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to list venues",
        error: error.message,
      }),
    };
  }
};

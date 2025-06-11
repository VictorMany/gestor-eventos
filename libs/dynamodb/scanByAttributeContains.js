const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getQueryByAttribute = async ({ tableName, attributeName, keyword }) => {
  const params = {
    TableName: tableName,
    FilterExpression: 'contains(#attr, :value)',
    ExpressionAttributeNames: {
      '#attr': attributeName,
    },
    ExpressionAttributeValues: {
      ':value': keyword,
    },
  };

  const result = await dynamoDb.scan(params).promise();
  return result.Items;
};

module.exports = getQueryByAttribute;

// libs/dynamodb/getQueryByAttribute.js
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Consulta una tabla DynamoDB usando un GSI.
 * 
 * @param {Object} params
 * @param {string} params.tableName - Nombre de la tabla (por ej. process.env.USERS_TABLE).
 * @param {string} params.indexName - Nombre del índice GSI (por ej. 'email-index').
 * @param {string} params.keyName - Nombre del atributo del GSI (por ej. 'email').
 * @param {string} params.keyValue - Valor del atributo a buscar (por ej. 'test@mail.com').
 * @returns {Promise<Array>} - Lista de resultados encontrados.
 */
const getQueryByAttribute = async ({ tableName, indexName, keyName, keyValue }) => {
  const params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: '#key = :value',
    ExpressionAttributeNames: {
      '#key': keyName,
    },
    ExpressionAttributeValues: {
      ':value': keyValue,
    },
  };

  const result = await dynamoDb.query(params).promise();
  return result.Items;
};

module.exports = getQueryByAttribute;

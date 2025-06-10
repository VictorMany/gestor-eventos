// libs/dynamodb/queryByAttribute.js
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

/**
 * Consulta una tabla DynamoDB usando un GSI.
 * 
 * @param {Object} params
 * @param {string} params.tableName - Nombre de la tabla (por ej. process.env.USERS_TABLE).
 * @param {string} params.indexName - Nombre del índice GSI (por ej. 'EmailIndex').
 * @param {string} params.keyName - Nombre del atributo del GSI (por ej. 'email').
 * @param {string} params.keyValue - Valor del atributo a buscar (por ej. 'test@mail.com').
 * @returns {Promise<Array>} - Lista de resultados encontrados.
 */
const queryByAttribute = async ({ tableName, indexName, keyName, keyValue }) => {
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

export default queryByAttribute;

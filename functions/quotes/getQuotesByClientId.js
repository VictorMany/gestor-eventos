const getQueryByAttribute = require('../../libs/dynamodb/getQueryByAttribute');

module.exports.handler = async (event) => {
  const clientId = event.queryStringParameters?.clientId;

  if (!clientId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing clientId parameter' }),
    };
  }

  try {
    const quotes = await getQueryByAttribute({
      tableName: process.env.QUOTES_TABLE,
      indexName: 'clientId-index',
      keyName: 'clientId',
      keyValue: clientId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(quotes),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
};

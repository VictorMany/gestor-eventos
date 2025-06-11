const getQueryByAttribute = require('../../libs/dynamodb/getQueryByAttribute');

module.exports.handler = async (event) => {
  const venueId = event.queryStringParameters?.venueId;

  if (!venueId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing venueId parameter' }),
    };
  }

  try {
    const quotes = await getQueryByAttribute({
      tableName: process.env.QUOTES_TABLE,
      indexName: 'venueId-index',
      keyName: 'venueId',
      keyValue: venueId,
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
}

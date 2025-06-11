const getQueryByAttribute = require('../../libs/dynamodb/getQueryByAttribute');

  
module.exports.handler = async (event) => {
  const vendorId = event.queryStringParameters?.vendorId;

  if (!vendorId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing vendorId parameter' }),
    };
  }

  try {
    const quotes = await getQueryByAttribute({
      tableName: process.env.QUOTES_TABLE,
      indexName: 'vendorId-index',
      keyName: 'vendorId',
      keyValue: vendorId,
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

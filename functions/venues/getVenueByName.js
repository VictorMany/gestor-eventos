const getQueryByAttribute = require('../../libs/dynamodb/getQueryByAttribute');

module.exports.handler = async (event) => {
  const name = event.queryStringParameters?.name;

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing name parameter' }),
    };
  }

  try {
    const venues = await getQueryByAttribute({
      tableName: process.env.VENUES_TABLE,
      indexName: 'name-index',
      keyName: 'name',
      keyValue: name,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(venues),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
}

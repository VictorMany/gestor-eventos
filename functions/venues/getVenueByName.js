const scanByAttributeContains = require('../../libs/dynamodb/scanByAttributeContains');

module.exports.handler = async (event) => {
  const name = event.queryStringParameters?.name;

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing name parameter' }),
    };
  }

  try {
    const venues = await scanByAttributeContains({
      tableName: process.env.VENUES_TABLE,
      attributeName: 'name',
      keyword: name,
    });

    if (!venues || venues.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Venue not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(venues),
    };
  } catch (err) {
    console.error('Error scanning venue by name:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

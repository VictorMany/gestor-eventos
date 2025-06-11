const scanByAttributeContains = require('../../libs/dynamodb/scanByAttributeContains');

module.exports.handler = async (event) => {
  const city = event.queryStringParameters?.city;

  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing city parameter' }),
    };
  }

  try {
    const venues = await scanByAttributeContains({
      tableName: process.env.VENUES_TABLE,
      attributeName: 'city',
      keyword: city,
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
    console.error('Error scanning venue by city:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

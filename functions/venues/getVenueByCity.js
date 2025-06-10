import queryByAttribute from '../../libs/dynamodb/queryByAttribute';

export async function handler(event) {
  const city = event.queryStringParameters?.city;

  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing city parameter' }),
    };
  }

  try {
    const venues = await queryByAttribute({
      tableName: process.env.VENUES_TABLE,
      indexName: 'city-index',
      keyName: 'city',
      keyValue: city,
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

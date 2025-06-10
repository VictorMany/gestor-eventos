import queryByAttribute from '../../libs/dynamodb/queryByAttribute';

export async function handler(event) {
  const name = event.queryStringParameters?.name;

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing name parameter' }),
    };
  }

  try {
    const venues = await queryByAttribute({
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

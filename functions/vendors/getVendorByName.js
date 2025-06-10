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
    const vendors = await queryByAttribute({
      tableName: process.env.VENDORS_TABLE,
      indexName: 'NameIndex',
      keyName: 'name',
      keyValue: name,
    });

    if (!vendors || vendors.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Vendor not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(vendors),
    };
  } catch (err) {
    console.error('Error querying vendor by name:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}

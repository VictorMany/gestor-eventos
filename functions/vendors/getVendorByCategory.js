import queryByAttribute from '../../libs/dynamodb/queryByAttribute';

export async function handler(event) {
  const category = event.queryStringParameters?.category;

  if (!category) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing category parameter' }),
    };
  }

  try {
    const vendors = await queryByAttribute({
      tableName: process.env.VENDORS_TABLE,
      indexName: 'CategoryIndex',
      keyName: 'category',
      keyValue: category,
    });

    if (!vendors || vendors.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No vendors found for this category' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(vendors),
    };
  } catch (err) {
    console.error('Error querying vendor by category:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}

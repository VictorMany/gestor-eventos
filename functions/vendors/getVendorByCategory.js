// functions/vendors/getVendorsByCategory.js
const scanByAttributeContains = require('../../libs/dynamodb/scanByAttributeContains');

module.exports.handler = async (event) => {
  const category = event.queryStringParameters?.category;

  if (!category) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing category parameter' }),
    };
  }

  try {
    const vendors = await scanByAttributeContains({
      tableName: process.env.VENDORS_TABLE,
      attributeName: 'category',
      keyword: category,
    });

    if (!vendors || vendors.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No vendors found for the given category' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(vendors),
    };
  } catch (err) {
    console.error('Error scanning vendors by category:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

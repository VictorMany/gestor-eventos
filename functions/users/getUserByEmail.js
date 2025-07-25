// functions/users/getUserByEmail.js
const getQueryByAttribute = require('../../libs/dynamodb/getQueryByAttribute');

module.exports.handler = async (event) => {
  const email = event.queryStringParameters?.email;

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing email parameter' }),
    };
  }

  try {
    const users = await getQueryByAttribute({
      tableName: process.env.USERS_TABLE,
      indexName: 'email-index',
      keyName: 'email',
      keyValue: email,
    });

    if (!users || users.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(users[0]), // Si sabes que es único
    };
  } catch (err) {
    console.error('Error querying user by email:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}

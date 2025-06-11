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
        const users = await scanByAttributeContains({
            tableName: process.env.VENDORS_TABLE,
            attributeName: 'name',
            keyword: name,
        });

        if (!users || users.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'User not found' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(users),
        };
    } catch (err) {
        console.error('Error scanning user by name:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' }),
        };
    }
};

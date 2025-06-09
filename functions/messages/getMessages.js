'use strict';

module.exports.getMessages = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'getMessages function executed successfully',
    }),
  };
};

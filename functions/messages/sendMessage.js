"use strict";

module.exports.sendMessage = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "sendMessage function executed successfully",
    }),
  };
};

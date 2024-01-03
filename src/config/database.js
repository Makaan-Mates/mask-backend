const mongoose = require("mongoose");

const databaseConnection = (url) => {
  return mongoose.connect(url);
};

module.exports = { databaseConnection };

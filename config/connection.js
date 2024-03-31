const mongoose = require("mongoose");

const dbName = 'socialmediaDB';
// Wrap Mongoose around local connection to MongoDB
mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`);

// Export connection
module.exports = mongoose.connection;
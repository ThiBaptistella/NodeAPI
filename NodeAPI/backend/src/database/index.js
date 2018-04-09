const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeAPI', {useMongoClient: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;

// Connect with my local database mongodb.

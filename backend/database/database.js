const mongoose = require('mongoose');
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = require('../config');

mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});

const db = mongoose.connection;

module.exports = db;
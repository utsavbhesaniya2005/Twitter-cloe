const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost:27017/twitter-clone')
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log('MongoDB Connection Error..'));

module.exports = db;
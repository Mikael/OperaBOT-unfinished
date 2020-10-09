const mongoose = require('mongoose');

const blacklistSchema = mongoose.Schema({
    ID: String,
    Type: String,
    Name: String
})

module.exports = mongoose.model("blacklist", blacklistSchema);
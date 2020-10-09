const mongoose = require('mongoose');

const tempbansSchema = mongoose.Schema({
    userID: String,
    serverID: String,
    time: Number
})

module.exports = mongoose.model("tempbans", tempbansSchema);
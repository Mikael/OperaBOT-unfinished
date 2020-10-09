const mongoose = require('mongoose');

const tempmutesSchema = mongoose.Schema({
    userID: String,
    serverID: String,
    time: Number
})

module.exports = mongoose.model("tempmutes", tempmutesSchema);
const mongoose = require('mongoose');

const pluginsSchema = mongoose.Schema({
    serverID: String,
    plugin: String
})

module.exports = mongoose.model("plugins", pluginsSchema);
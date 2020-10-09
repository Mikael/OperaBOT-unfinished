const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    message.channel.send("pong").then(r => {
        r.edit("```json\n"+ `Latency: ${Math.floor(r.createdTimestamp - message.createdTimestamp)} ms\nDiscord API: ${Math.floor(bot.ping)} ms` + "```")
    })
}

module.exports.help = {
    name: "ping",
    category: "Utility",
    description: "Returns Pong!",
    usage: ""
}
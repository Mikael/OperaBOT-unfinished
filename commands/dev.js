const Discord = require("discord.js");
const config = require("../config.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    if(message.author.id !== "249593620255080459" && message.author.id !== "469999926861103124") return;
    if(args[1] == "off"){
        try{
            delete require.cache[require.resolve(`./${args[2]}.js`)];
        }catch(e){
            return message.channel.send(`:x: Invalid module name!`);
        }
        bot.commands = bot.commands.filter(c => c.help.name !== args[2]);
        var embed = new Discord.RichEmbed()
        .setDescription(`:white_check_mark: ${args[2]} has been turned off (Global)`)
        .setColor(config.color)
        message.channel.send(embed);
    }else if(args[1] == "on"){
        try{
            var prop = require(`./${args[2]}.js`);
        }catch(e){
            return message.channel.send(`:x: Invalid module name!`);
        }
        bot.commands.set(prop.help, prop);
        var embed = new Discord.RichEmbed()
        .setDescription(`:white_check_mark: ${args[2]} has been turned on (Global)`)
        .setColor(config.color)
        message.channel.send(embed);
    }else if(args[1] == "restart"){
        message.channel.send(`Restarting ${args[2]}`).then(m => {
            bot.commands = bot.commands.filter(c => c.help.name !== args[2]);
            try{
                delete require.cache[require.resolve(`./${args[2]}.js`)];
            }catch(e){
                return m.edit(`:x: Invalid module name!`);
            }
            var prop = require(`./${args[2]}.js`);
            bot.commands.set(prop.help, prop);
            var embed = new Discord.RichEmbed()
            .setDescription(`:white_check_mark: ${args[2]} has been restarted (Global)`)
            .setColor(config.color)
            m.edit(embed);
        })
    }
}

module.exports.help = {
    name: "dev",
    category: "Developer",
    description: "xyz",
    visible: false
}
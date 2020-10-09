const Discord = require("discord.js");
const config = require("../config.json");
const Plugins = require("../modules/plugins.js");

function checkPlugin(plugins, name){
    var plugin = plugins.find(p => p.plugin == name);
    if(plugin) return ":octagonal_sign:";
    else return ":white_check_mark:";
}

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
    if(!args[1]){
        var embed = new Discord.RichEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL)
        .setColor(config.color)
        var random = Math.floor(Math.random()*2)+1;
        if(random == 1){
            embed.setFooter(`To disable function use: ${config.prefix}plugins off {command}`);
        }else{
            embed.setFooter(`To enable function use: ${config.prefix}plugins on {command}`);
        }
        var plugins = await Plugins.find({serverID: message.guild.id}).exec();
        bot.commands.forEach(c => {
            if(c.help.visible == false) return;
            embed.addField(c.help.name, `${checkPlugin(plugins, c.help.name)} | ${c.help.description}`);
        })
        message.channel.send(embed);
    }else if(args[1] == "on"){
        var plugin = args[2].toLowerCase();
        if(bot.commands.find(c => c.help.name == args[2])){
            var x = await Plugins.findOne({serverID: message.guild.id, plugin: plugin}).exec();
            try{
                x.remove();
            }catch(e){
                var embed = new Discord.RichEmbed()
                .setDescription(`:x: ${plugin} is already on!`)
                .setColor(config.color)
                return message.channel.send(embed);
            }
            var embed = new Discord.RichEmbed()
            .setDescription(`:white_check_mark: ${plugin} has been turned on!`)
            .setColor(config.color)
            message.channel.send(embed);
        }else{
            var embed = new Discord.RichEmbed()
            .setDescription(":x: Try: !plugins on [plugin_name]")
            .setColor(config.color)
            message.channel.send(embed);
        }
    }else if(args[1] == "off"){
        var plugin = args[2].toLowerCase();
        if(plugin == "plugins"){
            var embed = new Discord.RichEmbed()
            .setDescription(":x: You cannot disable this plugin")
            .setColor(config.color)
            return message.channel.send(embed);
        }
        if(bot.commands.find(c => c.help.name == plugin)){
            Plugins.findOne({
                serverID: message.guild.id,
                plugin: plugin
            }, (err, res) => {
                if(err) console.log(err);
                if(res){
                    var embed = new Discord.RichEmbed()
                    .setDescription(`:x: ${plugin} is already off!`)
                    .setColor(config.color)
                    message.channel.send(embed);
                }else{
                    var embed = new Discord.RichEmbed()
                    .setDescription(`:white_check_mark: ${plugin} has been turned off!`)
                    .setColor(config.color)
                    message.channel.send(embed);
                    new Plugins({
                        serverID: message.guild.id,
                        plugin: plugin
                    }).save().catch(err => console.log(err));
                }
            })
        }else{
            var embed = new Discord.RichEmbed()
            .setDescription(":x: Try: !plugins off [plugin_name]")
            .setColor(config.color)
            message.channel.send(embed);
        }
    }
}

module.exports.help = {
    name: "plugins",
    category: "Utility",
    description: "Shows functions status on this server",
    usage: ""
}
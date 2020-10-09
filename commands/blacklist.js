const Discord = require("discord.js");
const config = require("../config.json");
const Blacklist = require("../modules/blacklist.js");

module.exports.run = async (bot, message, args) => {
    if(message.author.id !== "249593620255080459" && message.author.id !== "469999926861103124") return;
    if(args[1] == "add"){
        Blacklist.findOne({
            ID: args[2]
        }, (err, res) => {
            if(err) console.log(err);
            if(bot.users.get(args[2])){
                var type = "user";
                var name = bot.users.get(args[2]).username
            }else if(bot.guilds.get(args[2])){
                var type = "server";
                var name = bot.guilds.get(args[2]).name;
            }
            if(res){
                var embed = new Discord.RichEmbed()
                .setDescription(`:x: This person/server is already on the blacklist`)
                .setColor(config.color)
                message.channel.send(embed);
            }else{
                new Blacklist({
                    ID: args[2],
                    Type: type,
                    Name: name
                }).save().catch(err => console.log(err))
                var embed = new Discord.RichEmbed()
                .setDescription(`:white_check_mark: A person/server has been added to the blacklist`)
                .setColor(config.color)
                message.channel.send(embed);
            }
        })
    }else if(args[1] == "remove" || args[1] == "del" || args[1] == "delete" || args[1] == "rem"){
        Blacklist.findOne({
            ID: args[2]
        }, (err, res) => {
            if(err) console.log(err);
            if(res){
                res.remove();
                var embed = new Discord.RichEmbed()
                .setDescription(`:white_check_mark: A person/server has been removed from the blacklist`)
                .setColor(config.color)
                message.channel.send(embed);
            }else{
                var embed = new Discord.RichEmbed()
                .setDescription(`:x: This person/server is not on the blacklist`)
                .setColor(config.color)
                message.channel.send(embed);
            }
        })
    }else{
        Blacklist.find().exec((err, res) => {
            if(err) console.log(err);
            var embed = new Discord.RichEmbed()
            .setAuthor("Blacklist", bot.user.displayAvatarURL)
            .setColor(config.color)
            .setFooter("!blacklist remove [ID] / !blacklist add [ID]")
            for(var i=0; i<25; i++){
                if(!res[i]) break;
                embed.addField(res[i].Name, `Type: ${res[i].Type}\nID: ${res[i].ID}`, true);
            }
            message.channel.send(embed);
        })
    }
}

module.exports.help = {
    name: "blacklist",
    category: "Developer",
    description: "xyz",
    visible: false
}
const Discord = require("discord.js");
const config = require("../config.json");
const Tempbans = require("../modules/tempbans.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("BAN_MEMBERS")) return;
    var punished = message.mentions.members.first();
    var reason = args.slice(3).join(" ");
    var time = ms(args[2]);
    if(!punished || time == undefined || time < 1){
        var embed = new Discord.RichEmbed()
        .setDescription(":x: Try: !tempban @mention [time] [reason]")
        .setColor(config.color)
        return message.channel.send(embed);
    }

    message.guild.ban(punished);

    var embed = new Discord.RichEmbed()
    .setAuthor("[Tempban]", punished.user.displayAvatarURL)
    .setThumbnail(punished.user.displayAvatarURL)
    .addField("Punished person", `<@${punished.user.id}> ${punished.user.tag}`)
    .addField("Punished by", `<@${message.author.id}> (${message.author.tag})`)
    .addField("Reason", (reason || "No reason"))
    .setFooter(`Duration: ${ms(time)}`)
    .setColor(config.color)
    Tempbans.findOne({
        userID: punished.user.id
    }, (err, res) => {
        if(err) console.log(err);
        var unmutetime = new Date().getTime()+time;
        if(res){
            res.time = unmutetime;
            res.save().catch(err => console.log(err));
        }else{
            new Tempbans({
                userID: punished.user.id,
                serverID: message.guild.id,
                time: unmutetime
            }).save().catch(err => console.log(err));
        }
    })
    message.channel.send(embed);
}

module.exports.help = {
    name: "tempban",
    category: "Moderation",
    description: "Temporarily server-bans a user",
    usage: ""
}
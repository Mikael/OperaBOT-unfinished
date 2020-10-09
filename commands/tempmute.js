const Discord = require("discord.js");
const config = require("../config.json");
const Tempmutes = require("../modules/tempmutes.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("KICK_MEMBERS")) return;
    var punished = message.mentions.members.first();
    var reason = args.slice(3).join(" ");
    var time = ms(args[2]);
    if(!punished || time == undefined || time < 1){
        var embed = new Discord.RichEmbed()
        .setDescription(":x: Try: !tempmute @mention [time] [reason]")
        .setColor(config.color)
        return message.channel.send(embed);
    }

    let muterole = message.guild.roles.find(r => r.name == "muted");
    if(!muterole){
        await message.guild.createRole({
            name: "muted",
            hoist: false,
            mentionable: false,
            permissions: []
        });
        muterole = message.guild.roles.find(r => r.name == "muted");
        message.guild.channels.filter(c => c.type == "text").forEach(r => {
            r.overwritePermissions(muterole, {SEND_MESSAGES: false, ADD_REACTIONS: false});
        })
    }
    punished.addRole(muterole);

    var embed = new Discord.RichEmbed()
    .setAuthor("[Tempmute]", punished.user.displayAvatarURL)
    .setThumbnail(punished.user.displayAvatarURL)
    .addField("Punished person", `<@${punished.user.id}> ${punished.user.tag}`)
    .addField("Punished by", `<@${message.author.id}> (${message.author.tag})`)
    .addField("Reason", (reason || "No reason"))
    .setFooter(`Duration: ${ms(time)}`)
    .setColor(config.color)
    Tempmutes.findOne({
        userID: punished.user.id
    }, (err, res) => {
        if(err) console.log(err);
        var unmutetime = new Date().getTime()+time;
        if(res){
            res.time = unmutetime;
            res.save().catch(err => console.log(err));
        }else{
            new Tempmutes({
                userID: punished.user.id,
                serverID: message.guild.id,
                time: unmutetime
            }).save().catch(err => console.log(err));
        }
    })
    message.channel.send(embed);
}

module.exports.help = {
    name: "tempmute",
    category: "Moderation",
    description: "Temporarily server-mutes a user",
    usage: ""
}
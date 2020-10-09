const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
const config = require("./config.json");
bot.commands = new Discord.Collection();
const mongoose = require('mongoose');
mongoose.connect(`mongoose url`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const XP = require("./modules/xp.js");
const Plugins = require("./modules/plugins.js");
const Blacklist = require("./modules/blacklist.js");
const Tempmutes = require("./modules/tempmutes.js");
const Tempbans = require("./modules/tempbans.js");

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${new Date().getHours()}:${new Date().getMinutes()} | ${f} loaded!`);
        bot.commands.set(props.help, props);
    })

})

bot.on("ready", () => {
    console.log(`${bot.user.username} is ready!`);
    for (let i = 1; i <= 20; i++) {
        setTimeout(async function() { 
            await Tempmutes.find({
                time: {$lt: new Date().getTime()}
            }, (err, res) => {
                if(err) console.log(err);
                if(res){
                    res.forEach(r => {
                        let muterole = bot.guilds.get(r.serverID).roles.find(r => r.name == "muted");
                        try{
                            bot.guilds.get(r.serverID).members.get(r.userID).removeRole(muterole)
                        }catch(e){}
                        r.remove();
                    })
                }
            })
            await Tempbans.find({
                time: {$lt: new Date().getTime()}
            }, (err, res) => {
                if(err) console.log(err);
                if(res){
                    res.forEach(r => {
                        try{
                            bot.guilds.get(r.serverID).unban(bot.users.get(r.userID));
                        }catch(e){}
                        r.remove();
                    })
                }
            })
        }, i*10000);
    }
})

bot.on("message", async message => {
    let messageArgs = message.content.split(" ");
    if(message.author.bot) return;
    if(message.channel.type == "dm") return;
    let cmd = messageArgs[0].toLowerCase();

    XP.findOne({
        userID: message.author.id,
        serverID: message.guild.id
    }, (err, res) => {
        if(err) console.log(err);
        var randomxp = Math.floor(Math.random()*10)+1;
        if(res){
            res.xp += randomxp;
            if(res.xp > Math.floor(res.level*311.75)){
                res.xp = randomxp;
                res.level++;
            }
            res.save().catch(err => console.log(err));
        }else{
            new XP({
                userID: message.author.id,
                level: 1,
                xp: randomxp,
                serverID: message.guild.id 
            }).save().catch(err => console.log(err));
        }
    })

    var pl = await Plugins.findOne({
        serverID: message.guild.id,
        plugin: cmd.slice(config.prefix.length)
    }).exec();
    if(pl) return;
    var bl = await Blacklist.findOne({
        $or: [
            {ID: message.author.id},
            {ID: message.guild.id}
        ]
    });
    if(bl) return;

    let commandfile = bot.commands.find(c => c.help.name == cmd.slice(config.prefix.length)) || bot.commands.find(c => c.help.aliases && c.help.aliases.includes(cmd.slice(config.prefix.length)));
    if(commandfile) commandfile.run(bot, message, messageArgs);
})

bot.login(config.token)
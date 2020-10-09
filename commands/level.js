const Discord = require("discord.js");
const Canvas = require("canvas");
const XP = require("../modules/xp.js");
Canvas.registerFont("./resources/Spartan-Light.ttf", {family: 'Spartan', weight: 400});
Canvas.registerFont("./resources/Spartan-Regular.ttf", {family: 'Spartan', weight: 500});
Canvas.registerFont("./resources/Spartan-SemiBold.ttf", {family: 'Spartan', weight: 600});
Canvas.registerFont("./resources/Lato-Regular.ttf", {family: 'Lato'});

module.exports.run = async (bot, message, args) => {
    if(message.mentions.members.first()){
        var user = message.mentions.members.first().user;
    }else{
        var user = message.author;
    }

    var xp = await XP.findOne({userID: user.id, serverID: message.guild.id}).exec();
    var xp_full = Math.floor(xp.level*311.75);

    const color = "#37bd5a";
    message.channel.startTyping();
    const canvas = Canvas.createCanvas(934, 282);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(0, 0, 934, 282);


    ctx.save();
    await Canvas.loadImage(user.displayAvatarURL).then(image => {
        ctx.beginPath();
        ctx.arc(152.5, 141, 87.5, 0, Math.PI * 2, true);
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.clip();
        ctx.closePath();
        ctx.drawImage(image, 65, 53.5, 175, 175);
    });
    ctx.restore();


    var posx = 280;
    var posy = 185;
    var height = 40;
    var width = 600;
    var round = 20;
    if((xp.xp / xp_full) < 0.05){
        width = 0;
        round = 0;
    }
    ctx.fillStyle = "rgba(20, 20, 20, 0.8)";
    roundRect(ctx, posx, posy, 600, height, 20, true, false) // Level full
    ctx.fillStyle = color;
    roundRect(ctx, posx, posy, (xp.xp/xp_full)*width, height, round, true, false) // Level progress


    ctx.font = '500 40px "Spartan"';
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(user.username, 285, 165);
    ctx.font = '400 20px "Spartan"';
    ctx.textAlign = "center";
    ctx.fillStyle = "#707070";
    ctx.fillText("#"+user.discriminator, (ctx.measureText(user.username).width*2)+325, 165);

    var stats_posy = 80;
    if(xp.level > 99){
        var stats_posx = 647;
    }else{
        var stats_posx = 687;
    }

    var ranking = await XP.find().sort([['level', 'descending']]).exec();
    var stats_rank = ranking.findIndex(r => r.userID == message.author.id)+1;

    ctx.font = '400 20px "Spartan"';
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    var rank = ctx.measureText("RANK").width;
    ctx.fillText("RANK", stats_posx, stats_posy);
    ctx.font = '60px "Lato"';
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    var rank_number = ctx.measureText("#"+stats_rank).width;
    ctx.fillText("#"+stats_rank, stats_posx, stats_posy);

    ctx.font = '400 20px "Spartan"';
    ctx.textAlign = "right";
    ctx.fillStyle = color;
    ctx.fillText("LEVEL", rank_number+rank+stats_posx+10, stats_posy);
    ctx.font = '60px "Lato"';
    ctx.textAlign = "left";
    ctx.fillStyle = color;
    ctx.fillText(xp.level, rank_number+rank+stats_posx+10, stats_posy);

    if(xp.xp > 999){
        var xp_string = `${Math.floor(xp.xp/10)/100}K`;
    }else{
        var xp_string = xp.xp;
    }
    if(xp_full > 999){
        xp_full = `${Math.floor(xp_full/10)/100}K`;
    }

    ctx.font = '400 20px "Spartan"';
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${xp_string}`, 780, 165);
    ctx.font = '400 20px "Spartan"';
    ctx.textAlign = "left";
    ctx.fillStyle = "#707070";
    ctx.fillText(`/${xp_full} XP`, 780, 165);


    const attachment = new Discord.Attachment(canvas.toBuffer(), "profile-card.png");
    message.channel.send(attachment);
    message.channel.stopTyping();
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  
  }

module.exports.help = {
    name: "level",
    category: "Utility",
    description: "Check your level!",
    usage: "",
    aliases: ["rank", "profile", "card"]
}
const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "blur",
  aliases: [""],
  category: "🕹️ Fun",
  description: "IMAGE CMD",
  usage: "blur @User",
  type: "user",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "FUN")){
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(es.footertext, es.footericon)
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          ]});
        }

    try {
      let tempmsg = await message.reply({embeds : [new MessageEmbed()
        .setColor(es.color)
        .setFooter(es.footertext, es.footericon)
        .setAuthor( 'Getting Image Data..', 'https://images-ext-1.discordapp.net/external/ANU162U1fDdmQhim_BcbQ3lf4dLaIQl7p0HcqzD5wJA/https/cdn.discordapp.com/emojis/756773010123522058.gif')
      ]});
            //find the USER
      let user = message.mentions.users.first();
      if(!user && args[0] && args[0].length == 18) {
        let tmp = await client.users.fetch(args[0]).catch(() => {})
        if(tmp) user = tmp;
        if(!tmp) return message.reply({content : eval(client.la[ls]["cmds"]["fun"]["blur"]["variable2"])})
      }
      else if(!user && args[0]){
        let alluser = message.guild.members.cache.map(member=> String(member.user.username).toLowerCase())
        user = alluser.find(user => user.includes(args[0].toLowerCase()))
        user = message.guild.members.cache.find(me => (me.user.username).toLowerCase() == user).user
        if(!user || user == null || !user.id) return message.reply({content : eval(client.la[ls]["cmds"]["fun"]["blur"]["variable3"])})
      }
      else {
        user = message.mentions.users.first() || message.author;
      }
      let avatar = user.displayAvatarURL({
        dynamic: false,
        format: "png"
      });
      let image = await canvacord.Canvas.blur(avatar);
      let attachment = await new MessageAttachment(image, "blur.png");

      message.reply({embeds : [tempmsg.embeds[0]
        .setAuthor(`Meme for: ${user.tag}`,avatar)
        .setColor(es.color)        
        .setImage("attachment://blur.png") 
      ], files : [attachment]}).catch(() => {})
        .then(msg => tempmsg.delete().catch(() => {}))
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(es.footertext, es.footericon)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["blur"]["variable4"]))
      ]});
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/rprj5sHWVQ
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */

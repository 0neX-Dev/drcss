const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
module.exports = {
  name: "toggledisabled",
  aliases: [ "toggleshowdisabled" ],
  category: "⚙️ Settings",
  description: "Toggles if the Bot help Message should show Disabled Commands or not [DEFAULT: true]",
  usage: "toggledisabled",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {

      client.settings.set(message.guild.id, !client.settings.get(message.guild.id, "showdisabled"), `showdisabled`);
      return message.reply({embeds : [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
        .setFooter(es.footertext, es.footericon)
        .setTitle(`<a:yes:833101995723194437> ${client.settings.get(message.guild.id, "showdisabled") ? "Enabled": "Disabled"} Disabled-Cmds Showing`)
        .setDescription(`${client.settings.get(message.guild.id, "showdisabled") ? "I will now show disabled commands in the Help Menu" : "I will not show disabled Commands in the Help Menu"}`.substr(0, 2048))
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds :[new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(es.footertext, es.footericon)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["settings"]["toggleunknowncommandinfo"]["variable2"]))
       ]} );
    }
  }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/rprj5sHWVQ
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */

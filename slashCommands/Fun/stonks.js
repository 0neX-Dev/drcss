const Discord = require("discord.js");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
module.exports = {
  name: "stonks",
  aliases: [""],
  category: "🕹️ Fun",
  description: "IMAGE CMD",
  usage: "stonks <TEXT>",
  type: "text",
  options: [
    { "String": { name: "text", description: "What should I send? [ +n+ = Newline ]", required: true } }, //to use in the code: interacton.getString("title")
  ],
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {

    if (!client.settings.get(message.guild.id, "FUN")) {
      return interaction?.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(es.footertext, es.footericon)
          .setTitle(client.la[ls].common.disabled.title)
          .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, { prefix: prefix }))
        ], ephemeral: true
      });
    }
    await interaction?.deferReply({ephemeral: false});
    //get the additional text
    const text = interaction?.options.getString("text"); //same as in StringChoices //RETURNS STRING 
    //If no text added, return error
    if (!text) return interaction?.editReply({
      embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(es.footertext, es.footericon)
        .setTitle(eval(client.la[ls]["cmds"]["fun"]["stonks"]["variable2"]))
        .setDescription(eval(client.la[ls]["cmds"]["fun"]["stonks"]["variable3"]))]
    }).catch(() => {})

    //get the memer image
    client.memer.stonks(text).then(image => {
      //make an attachment
      var attachment = new MessageAttachment(image, "stonks.png");
      //send new Message
      interaction?.editReply({
        embeds: [new MessageEmbed()
          .setColor(es.color)
          .setFooter(es.footertext, es.footericon)
          .setAuthor(`Meme for: ${message.author.tag}`, message.author.displayAvatarURL())
          .setImage("attachment://stonks.png")
        ], files: [attachment], ephemeral: true
      }).catch(() => {})
    })

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
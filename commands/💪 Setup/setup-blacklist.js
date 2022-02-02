var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing, swap_pages, swap_pages2
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-blacklist",
  category: "💪 Setup",
  aliases: ["setupblacklist", "blacklist-setup", "blacklistsetup"],
  cooldown: 5,
  usage: "setup-blacklist  -->  Follow the Steps",
  description: "Blacklist specific Words in your Server",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      first_layer()
      async function first_layer(){
        let menuoptions = [
          {
            value: "Add Blacklisted-Word",
            description: `Add a Word to the Blacklisted Words`,
            emoji: "✅"
          },
          {
            value: "Remove Blacklisted-Word",
            description: `Remove a Word from the Blacklisted Words`,
            emoji: "🗑️"
          },
          {
            value: "Show Settings",
            description: `Show all Blacklisted Words Settings`,
            emoji: "📑"
          },
          {
            value: "Reset Blacklist",
            description: `Delete/Reset all Blacklisted Words`,
            emoji: "💥"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Auto-Meme-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Click me to setup the Automated Meme System!') 
          .addOptions(
          menuoptions.map(option => {
            let Obj = {
              label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
              value: option.value.substr(0, 50),
              description: option.description.substr(0, 50),
            }
          if(option.emoji) Obj.emoji = option.emoji;
          return Obj;
         }))
        
        //define the embed
        let MenuEmbed = new MessageEmbed()
        .setColor(es.color)
        .setAuthor('Setup Blacklist', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/291/stop-sign_1f6d1.png', 'https://discord.gg/rprj5sHWVQ')
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            used1 = true;
            handle_the_picks(menu?.values[0], menuoptiondata)
          }
          else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype){
          case "Add Blacklisted-Word": { 
            var tempmsg = await message.reply({embeds: [new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable6"]))
              .setFooter(es.footertext, es.footericon)]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
            
              if (message.content) {
                try {
                  var blacklistedwords = message.content.split(",").filter(Boolean).map(item => item.trim().toLowerCase());
                  var notadded = []
                  for(const blacklistword of blacklistedwords){
                    if(client.blacklist.get(message.guild.id, "words").includes(blacklistword)){
                      notadded.push(blacklistword);
                    }else {
                      client.blacklist.push(message.guild.id, blacklistword, "words")
                    }
                  }
                  return message.reply({embeds: [new MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable7"]))
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable8"]))
                    .setColor(es.color)
                    .setFooter(es.footertext, es.footericon)]}
                  );
                } catch (e) {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({embeds: [new MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable9"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable10"]))
                    .setFooter(es.footertext, es.footericon)]}
                  );
                }
              } else {
                message.reply( "you didn't ping a valid Role")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({embeds: [new MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable11"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(es.footertext, es.footericon)]}
              );
            })
          }
          break;
          case "Remove Blacklisted-Word": { 
            var tempmsg = await message.reply({embeds: [new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable12"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable13"]))
              .setFooter(es.footertext, es.footericon)]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
              })
              .then(collected => {
                var message = collected.first();
               
                if (message.content) {
                  try {
                    var blacklistedwords = message.content.split(",").filter(Boolean).map(item => item.trim().toLowerCase());
                    var notremoved = []
                    for(const blacklistword of blacklistedwords){
                      if(!client.blacklist.get(message.guild.id, "words").includes(blacklistword)){
                        notremoved.push(blacklistword);
                      }else {
                        client.blacklist.remove(message.guild.id, blacklistword, "words")
                      }
                    }
                    return message.reply({embeds: [new MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable14"]))
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable15"]))
                      .setColor(es.color)
                      .setFooter(es.footertext, es.footericon)]}
                    );
                  } catch (e) {
                    console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    return message.reply({embeds: [new MessageEmbed()
                      .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable16"]))
                      .setColor(es.wrongcolor)
                      .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable17"]))
                      .setFooter(es.footertext, es.footericon)]}
                    );
                  }
                } else {
                  message.reply( "you didn't ping a valid Role")
                }
              })
              .catch(e => {
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                return message.reply({embeds: [new MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable18"]))
                  .setColor(es.wrongcolor)
                  .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                  .setFooter(es.footertext, es.footericon)]}
                );
              })
          }
          break;
          case "Show Settings": { 
            return swap_pages(client, message, `${client.blacklist.get(message.guild.id, "words").map(word => `\`${word}\``).join(", ").split("`").join("\`")}`, `${message.guild.name} | Blacklisted Words`);
          }
          break;
          case "Reset Blacklist": { 
            client.blacklist.set(message.guild.id, [], "words")
            return message.reply({embeds: [new MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable19"]))
              .setColor(es.color)
              .setFooter(es.footertext, es.footericon)]}
            );
          }
          break;
        }
      }
      
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(es.footertext, es.footericon)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-blacklist"]["variable21"]))]}
      );
    }
  },
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
const { MessageEmbed } = require('discord.js');
const Settings = require('../models/Settings')

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.guild && !client.settings.has((message.guild || {}).id)) {
    // We don't have the settings for this guild, find them or generate empty settings
    let s = (await Settings.findOneAndUpdate({ _id: message.guild.id }, {}, { upsert: true, setDefaultsOnInsert: true, new: true }).populate('mentorRoles').populate('commands').catch(console.error)).toObject()
    client.settings.set(message.guild.id, s)
    message.settings = s
  } else message.settings = client.settings.get(message.guild ? message.guild.id : 'default')
  // Do whatever message filtering here
  const level = client.permlevel(message);
  if (level == -1) return // The bot isn't actually ready yet
  message.author.permLevel = level

  if (!message.content.startsWith(client.prefix)) return next();
  let args = message.content.substring(client.prefix.length).split(' ')
  let command = args.shift().toLowerCase()
  let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // If the command is undefined, lets see if it exists in message settings
  if (!cmd && level > 0) {
    // Uhhhhhhh..... Lets see if we have a command with that trigger
    if (message.settings.commands.filter(c => c.trigger == command).length == 1) {
      // We just send an embed with the c content
      return message.channel.send({embeds:[new MessageEmbed({ color: client.randomColor(), description: message.settings.commands.filter(c => c.trigger == command)[0].content })]})
    }
  }
  if (!cmd) return next();
  // Check if the user's permlevel is high enough to run the command
  if (level < client.levelCache[cmd.conf.permLevel]) return next();
  const ret = await cmd.run(client, message, args);
  if(ret && ret.description) {
    await message.channel.send({embeds:[ret]})
  }

  next();
  // Only called if the command pipeline was interrupted and the bot was ready to handle it
  async function next() {
    // Lets first check if the message is in one of the mentor roles' channels
    if (message.settings.mentorRoles.map(mR => mR.assignedChannels).flat(1).includes(message.channel.id)) {
      // Yep. I guess we look for thanks now
      const thanks = ['ty', 'thanks', 'thank you', 'tyvm', 'tysm', 'thank']
      const thanksRegex = new RegExp(`(?:^| )(${thanks.join('|')})(?:$| )`, 'gi')
      if (message.content.match(thanksRegex)) {
        /**
         * They did have a thanks in there somewhere
         * 
         * Parsing the intent behind a message is too much hassle.
         * We'll only give the user a "thank" if there is no ambiguity.
         * 
         * In this case, no ambiguity means they either pinged only that user, or replied to that user and didn't ping anyone
         */

        let hasPing = false;
        let hasReply = false;
        if (message.reference && message.reference.channelID === message.channel.id) {
          hasReply = true;
        }
        if (message.mentions.members?.size == 1) {
          hasPing = true
        } else if (message.mentions.members?.size > 1) {
          // Ambiguous
          return;
        }
        if (hasPing ^ hasReply) { // bitwise XOR, very nice
          // There is no ambiguity!
          if (hasPing) {
            // This is easy. Just give a thanks to the first message.mentions.members
            client.emit('newThank', { message, thankedMember: message.mentions.members.first() })
          } else {
            // Fetch the referenced message
            let refd = await message.channel.messages.fetch(message.reference.messageID).catch(() => { })
            if (!refd) return; // Referenced message wasn't found. It's deleted already lmao
            client.emit('newThank', { message, thankedMember: refd.member })
          }
        }

      }
    }
  }
}

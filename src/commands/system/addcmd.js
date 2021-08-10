const Command = require('../../models/Command')
const Settings = require('../../models/Settings')
exports.run = async (client, message, [command, ...content]) => {
  return Promise.resolve().then(async () => {
    try {
      if (!command || content.length == 0) return message.channel.send({embeds: [client.errEmb(1)]})
      
      console.log(message.settings.commands)
      console.log(message.settings.commands.filter(c => c.trigger == command.toLowerCase()))
      console.log(message.settings.commands.filter(c => c.trigger == command.toLowerCase()).length)

      if (message.settings.commands.filter(c => c.trigger == command.toLowerCase()).length >= 1) return message.channel.send({embeds: [client.errEmb(2, `Command \`${command.toLowerCase()}\` is already defined.`)]})
      // I guess I just add the command into commands?
      let o = await (new Command({ trigger: command.toLowerCase(), content: content.join(' '), guild: message.settings._id })).save()
      client.settings.set(message.settings._id, (await Settings.findOneAndUpdate({ _id: message.settings._id }, { $push: { commands: o._id } }, { upsert: true, setDefaultsOnInsert: true, new: true }).populate('mentorRoles').populate('commands')).toObject())
      return message.channel.send({
        embeds: [{
          description: `Successfully added command ${command.toLowerCase()}`,
          color: 'GREEN'
        }]
      })
    } catch (e) {
      client.log('err', e)
    }
  })
};


exports.conf = {
  aliases: ['addcommand'],
  permLevel: "Administrator"
};

exports.help = {
  name: "addcmd",
  description: `Add custom command`,
};
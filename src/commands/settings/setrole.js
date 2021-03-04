const { MessageEmbed } = require('discord.js');

const rolesAvailable = Object.keys(require('../../models/Settings').schema.paths).filter(s => s.startsWith('roles.')).map(c => c.substring(6))
exports.run = async (client, message, [roleName, roleID, ...args]) => {
  return Promise.resolve().then(async () => {
    try {
      if (!roleName) return message.channel.send(client.errEmb(1))
      if (!rolesAvailable.includes(roleName.toLowerCase())) return message.channel.send(client.errEmb(2, `Use one of the following: \`${rolesAvailable.join('`, `')}\``))
      // Now lets parse the roleID
      let match = roleID.match(/\d{17,19}/)
      if (!match) return message.channel.send(client.errEmb(2, `Argument 2 (\`${roleID}\`) was not found to be a valid @role or roleID!`))
      let role = match[0]
      if (!message.guild.roles.cache.has(role)) return message.channel.send(client.errEmb(2, `Argument 2 (\`${roleID}\`) was not found to be a valid @role or roleID!`))
      client.settings.get(message.guild.id).roles = { ...client.settings.get(message.guild.id).roles || {}, [roleName.toLowerCase()]: role }
      client.settings.get(message.guild.id).updatedAt = new Date().toISOString()
      message.channel.send(new MessageEmbed({ color: 'GREEN', description: `Set everyone with role <@&${role}> to be considered \`${roleName.toLowerCase()}\`` }))
    } catch (e) {
      client.log('err', e)
    }
  })
};


exports.conf = {
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "setrole",
  description: `Sets roles :)`,
};
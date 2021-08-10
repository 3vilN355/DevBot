const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, [member]) => {
  return Promise.resolve().then(async () => {
    try {
      let ID = member.match(/\d{17,19}/)[0]
      member = await message.guild.members.fetch(ID)
      message.channel.send({ embeds: [new MessageEmbed({ color: 'GREEN', description: client.permlevel(null, member) })] })

    } catch (e) {
      client.log('err', e)
      message.channel.send({ embeds: [{ color: 'RED', description: e }] })
    }
  })
};


exports.conf = {
  aliases: ['pl'],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "permlevel",
  description: `Calculates someone's perm level`,
};
const { MessageEmbed } = require("discord.js");
const axios = require('axios');

exports.run = async (client, message, args) => {
  return Promise.resolve().then(async () => {
    try {

      if (args.length == 0) return message.channel.send({embeds: [client.errEmb(1)]});

      let match = args[0].match(/^\d{17,19}$/);
      let gKey = 'AIzaSyCb03tEOx3E9wKQ9b-avD7sgMCYTYiZwLo'
      let csx = 'a06ff989be2a659c7'
      let query;
      if (!match) {
        query = args.join(' ')
      } else {
        query = await message.channel.messages.fetch(match[0])
        if (!query) return message.channel.send({embeds: [client.errEmb(2, 'Please enter your search term!')]});
        else query = query.content
      }

      if (!query) return message.channel.send({embeds: [client.errEmb(2, 'Please enter your search term!')]});

      href = await search(query);
      if (!href) return message.channel.send({embeds: [client.errEmb(2, "Unknown Search.")]});

      const embed = new MessageEmbed()
        .setTitle(`Heres what i found for ${query}`)
        .setDescription(href.snippet)
        .setURL(href.link)
        .setColor('#2eabff')

      message.channel.send({embeds: [embed]})
      async function search(query) {
        const { data } = await axios.get("https://www.googleapis.com/customsearch/v1", {
          params: {
            key: gKey, cx: csx, safe: 'off', q: query
          }
        });

        if (!data.items) return null;
        return data.items[0];
      }
    } catch (e) {
      client.log('err', e)
    }
  })
};


exports.conf = {
  aliases: ['g'],
  permLevel: "Mentor"
};

exports.help = {
  name: "google",
  description: `Generate a link to google!`,
};
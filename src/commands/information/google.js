const { MessageEmbed } = require("discord.js");
const serp = require("serp");

exports.run = async (client, message, args) => {
    return Promise.resolve().then(async () => {
      try{
        // Are any arguments given?
        if(args.length == 0) return message.channel.send(client.errEmb(1))
        if(args.length == 1){
          // Check if it fits the message ID criteria
          let match = args[0].match(/^\d{17,19}$/)
          if(match){
            // Its a link to a message. Lets find that message!
            let msg = await message.channel.messages.fetch(match[0]).catch(e => {})
            if(msg){
              // We found the message!
              const links = await serp.search({host:'google.com',qs:{q:msg.content}, num:1});
              if(links.length == 0) return message.channel.send(new MessageEmbed({color:`RED`, description: `No results found for \`${msg.content}\``}))
              return message.channel.send(`${msg.author}, here's a google search for \`${msg.content}\`!`, {embed: new MessageEmbed({color:`GREEN`, description: `[${links[0].title}](${links[0].url})`})})
            }
          }
          // If it didn't find a message or it didn't match, just search for the arg
          
          const links = await serp.search({host:'google.com',qs:{q:args[0]}, num:1});
          
          if(links.length == 0) return message.channel.send(new MessageEmbed({color:`RED`, description: `No results found for \`${args[0]}\``}))
          message.channel.send(new MessageEmbed({color:`GREEN`, description: `Here's what google came up with for \`${args[0]}\`!\n[${links[0].title}](${links[0].url})`}))
        } else {
          const links = await serp.search({qs:{q:args.join(' ')}, num:1});
          if(links.length == 0) return message.channel.send(new MessageEmbed({color:`RED`, description: `No results found for \`${args.join(' ')}\``}))
          message.channel.send(new MessageEmbed({color:`GREEN`, description: `Here's what google came up with for \`${args.join(' ')}\`!\n[${links[0].title}](${links[0].url})`}))
        }
      }catch(e){
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
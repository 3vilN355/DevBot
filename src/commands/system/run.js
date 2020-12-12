const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  return Promise.resolve().then(async () => {
    try{
      // Eval the code
      let e = await eval(args.join(' '))
      if(typeof(e) == 'object') e = JSON.stringify(e)
      else if(typeof(e) != 'string') e = e.toString()
      message.channel.send(new MessageEmbed({description: e}))
    }catch(e){
      client.log('err', e)
    }
  })
};


exports.conf = {
    aliases: ['r'],
    permLevel: "Bot Owner"
};

exports.help = {
    name: "run",
    description: `Evals code`,
};
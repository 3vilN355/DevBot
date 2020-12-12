const subcmds = ['list','add','remove']
exports.run = async (client, message, [subcmd, ...args]) => {
  return Promise.resolve().then(async () => {
    try{
      if(!subcmd) return message.channel.send(client.errEmb(1))
      if(!subcmds.includes(subcmd.toLowerCase())) return message.channel.send(client.errEmb(2, `Use one of the following: \`${subcmds.join('`, `')}\``))
      let i = subcmds.indexOf(subcmd.toLowerCase())
      if(i == 0){
        // They want a list. Fuck this for now
      } else if(i == 1){
        // Add a mentor thing.
      } else if(i == 2){
        // Remove a mentor thing
      }
    }catch(e){
      client.log('err', e)
    }
  })
};


exports.conf = {
    aliases: [],
};

exports.help = {
    name: "mentor",
    description: `Idk, does some mentor shit`,
};
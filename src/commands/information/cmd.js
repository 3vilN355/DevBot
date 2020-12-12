exports.run = async (client, message, args) => {
    return Promise.resolve().then(async () => {
      try{
        message.channel.send(`Some random command idk`)
      }catch(e){
        client.log('err', e)
      }
    })
  };
  
  
  exports.conf = {
      aliases: ['c'],
      permLevel: "User"
  };
  
  exports.help = {
      name: "cmd",
      description: `Some description of the command`,
  };
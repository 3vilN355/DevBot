exports.run = async (client, message, args) => {
  return Promise.resolve().then(async () => {
    try{

    }catch(e){
      client.log('err', e)
    }
  })
};


exports.conf = {
    aliases: ['Aliases here'],
    permLevel: "Refer to config.js"
};

exports.help = {
    name: "template",
    description: `Some description of the command`,
};
const { MessageEmbed } = require("discord.js");

exports.run = async(client, message, args) => {
  try{
    //creating the custom embed the old fashioned way bc im lazy asf lol
    const embed = new MessageEmbed()
    .setColor("RANDOM")
    .addField("Incorrect Formatting", "We'd prefer if you avoiding asking questions like \" I need help \", instead, just present your problem.", true)
    
    //any arguments?
    if (args.length == 0) return message.channel.send(client.errEmb(1));
    
    //lets only run this IF and only if the user gives arguments after.
    if (args.length == 1) {
    
        //find the message.
    let match = args[0].match(/^\d{17,19}$/);
  if(match){
    
    //you guys know what this does by now.. 
    let msg = await message.channel.messages.fetch(match[0]).catch(e => { });
    
    //any message?
     if(!msg) return message.channel.send(client.errEmb(0, `Failed to resolve ${match} to a message.`))
    
    //deletes the located message, as we want them to reformat correctly.
     msg.delete()
    
     //deletes the command message.
    message.delete()
    
    message.channel.send(`Hello ${msg.author}`)
    
    message.channel.send(embed)
  }
  }else {
    return message.channel.send(client.errEmb(2, 'please provide a valid message ID!'));
  }
  }catch(e){
      client.log('err', e)
  }
}

exports.conf = {
    aliases: ['a2a'], 
    permLevel: "User"
}

exports.help = {
    name: 'a2a', 
    description: 'tells you to do more than just say "i need help" you fucking idiot'
}
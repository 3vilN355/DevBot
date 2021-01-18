exports.run = async (client, message, args) => {
    return Promise.resolve().then(async () => {
      try {
        // Are any arguments given?
        if (args.length == 0) return message.channel.send(client.errEmb(1));

        if (args.length == 1 || args.length == 2) {
          // Check if it fits the message ID criteria
          let match = args[0].match(/^\d{17,19}$/);

          if (match) {
              // Its a link to a message. Lets find that message!
              let msg = await message.channel.messages.fetch(match[0]).catch(e => {});

              let max = 1993;
              if (args.length == 2) {
                max -= args[1].length;
              }

              //make sure code block will fit under 2000 characters
              if (msg.content.length > max) return message.channel.send(client.errEmb(2, `Message too long. Please keep it ${max} characters or fewer`));
              
              //sends code block version
              message.channel.send(`code by ${msg.author}:`)

              if (args.length == 1)
                message.channel.send('```\n' + msg.content + '```')
              if (args.length == 2)
                message.channel.send('```' + args[1] + '\n' + msg.content + '```');

          } else {
            return message.channel.send(client.errEmb(2, 'please provide a valid message ID!'));
          }
        }
      } catch(e){
        client.log('err', e)
      }
    })
  };

exports.conf = {
    aliases: ['cb'],
    permLevel: "Mentor"
};

exports.help = {
    name: "codeblock",
    description: `converts message into code block`,
};
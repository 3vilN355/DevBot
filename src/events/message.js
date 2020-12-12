const Settings = require('../models/Settings')
module.exports = async (client, message) => {
    if(message.author.bot) return;
    if(message.guild && !client.settings.has((message.guild||{}).id)) {
        // We don't have the settings for this guild, find them or generate empty settings
        let s = (await Settings.findOneAndUpdate({_id:message.guild.id}, {}, {upsert:true, setDefaultsOnInsert:true, new:true}).populate('Mentor').catch(console.error)).toObject()
        client.settings.set(message.guild.id, s)
        message.settings = s
    } else message.settings = client.settings.get(message.guild?message.guild.id:'default')
    // Do whatever message filtering here
    const level = client.permlevel(message);
    console.log(level)
    if(level == -1) return // The bot isn't actually ready yet
    
    if(!message.content.startsWith(client.prefix)) return;
    let args = message.content.substring(client.prefix.length).split(' ')
    let command = args.shift().toLowerCase()
    let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    // Check if the user's permlevel is high enough to run the command
    if (level < client.levelCache[cmd.conf.permLevel]) return;
    await cmd.run(client, message, args)
}
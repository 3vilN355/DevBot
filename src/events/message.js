const Settings = require('../models/Settings')
module.exports = async (client, message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(client.prefix)) return;
    if(message.guild && !client.settings.has((message.guild||{}).id)) {
        // We don't have the settings for this guild, generate empty settings
        let s = (await Settings.findOneAndUpdate({_id:"default"}, {}, {upsert:true, setDefaultsOnInsert:true, new:true})).toObject()
        client.settings.set(message.guild.id, s)
        message.settings = s
    }
    // Do whatever message filtering here

    let args = message.content.substring(client.prefix.length).split(' ')
    let cmd = args.shift()
    if(client.commands.has(cmd.toLowerCase())){
        await client.commands.get(cmd.toLowerCase()).run(client, message, args)
    } else if(client.aliases.has(cmd.toLowerCase())){
        await client.commands.get(client.aliases.get(cmd.toLowerCase())).run(client, message, args)
    }
}
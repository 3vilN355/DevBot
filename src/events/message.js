module.exports = async (client, message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(client.prefix)) return;
    // Do whatever message filtering here

    let args = message.content.substring(client.prefix.length).split(' ')
    let cmd = args.shift()
    if(client.commands.has(cmd.toLowerCase())){
        await client.commands.get(cmd.toLowerCase()).run(client, message, args)
    } else if(client.aliases.has(cmd.toLowerCase())){
        await client.commands.get(client.aliases.get(cmd.toLowerCase())).run(client, message, args)
    }
}
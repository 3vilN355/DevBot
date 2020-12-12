module.exports = async (client, message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(client.prefix)) return;
    // Do whatever message filtering here

    let args = message.content.substring(client.prefix.length).split(' ')
    console.log(args)
    let cmd = args.shift()
    console.log(cmd)
    if(client.commands.has(cmd.toLowerCase())){
        await client.commands.get(cmd.toLowerCase()).run(client, message, args)
    }
}
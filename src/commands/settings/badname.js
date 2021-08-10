const BadNamer = require('../../../util/badname');
//Untested
let badNamer = null

exports.run = async (client, message, args) => {
    return Promise.resolve().then(async () => {
        if(!args[0]) return client.errEmb(1);
        if(!/\d{17,19}/.test(args[0])) return client.errEmb(2);

        let id;
        try {
            id = args[0].match(/\d{17,19}/)[0]
        } catch (e) {
            return client.errEmb(0, `Something wrong happened 🤷‍♂️`);
        }

        // Fetch the user mentioned
        let member = await message.guild.members.fetch(id).catch();

        if(client.permlevel(message) <= client.permlevel(null, member)) return client.errEmb(0, `You don't have permission to badname that person.`)
        
        if(!member) return client.errEmb(0, `Did you provide me with an invalid user ID?`);
        if(!member.manageable) return client.errEmb(0, `I don't have permission to manage that user.`);

        //Lazy initialization
        if (badNamer === null) {
            badNamer = new BadNamer()
        }
        let num = await client.getNextCounter("Badname")
        let name = badNamer.get(num)
        console.log(num)
        console.log(name)
        await member.setNickname(name).catch(e => {
            console.error(e)
        })
        return {description: `Successfully changed ${member}'s nickname`}
    })
}

exports.conf = {
    aliases: [],
    permLevel: "Helper"
};

exports.help = {
    name: "badname",
    description: `Gives a random name`,
};
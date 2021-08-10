
//Untested
let badNamer = null

exports.run = async (client, message, args) => {
    return Promise.resolve().then(async () => {
        //Lazy initialization
        if (badNamer === null) {
            badNamer = new BadNamer()
        }
        await message.member.setNickname(badNamer.get(client.getNextCounter("Badname")))
    })
}

exports.conf = {
    aliases: [],
    permLevel: "Helper"
};

exports.help = {
    name: "setname",
    description: `Gives a random name`,
};
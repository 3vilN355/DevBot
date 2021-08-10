
//Untested
let badNamer = null

exports.run = async (client, message, args) => {
    return Promise.resolve().then(async () => {
        //Lazy initialization
        if (badNamer === null) {
            badNamer = new BadNamer(COMBINATIONS)
        }
        await message.member.setNickname(badNamer.get(client.getNextCaseNum("Counter")))
    })
}

exports.conf = {
    aliases: [],
    permLevel: "Helper"
};

exports.help = {
    name: "badnamev2",
    description: `Gives a random name`,
};
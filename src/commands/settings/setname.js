
//Untested
let badNamer = null

exports.run = async (client, message, args) => {
    return Promise.resolve().then(async () => {
        //Lazy initialization
        if (badNamer === null) {
            badNamer = new BadNamer(COMBINATIONS)
        }
        message.member.setName(badNamer.get(client.getNextCaseNum("Counter")))
    })
}
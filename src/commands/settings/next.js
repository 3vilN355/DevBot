// Pick users from this channel
const pickFrom = "800087453359669248"
// Add them to this channel
const addTo = "800079284936769536"
// Ignore these people
const ignore = [
  "136985027413147648",
  "224283992013275148",
]

exports.run = async (client, message, [amount]) => {
  return Promise.resolve().then(async () => {
    if(!ignore.includes(message.author.id)) return;
    let users = 1;
    if(amount && /^\d+$/.test(amount)){
      users = parseInt(amount);
    }
    // Kick the person in the VC that isn't in the ignore list
    let ch = client.channels.cache.get(addTo)
    const kicked = []
    for(const kickable of ch.members.filter(mem => !ignore.includes(mem.id))){
      kicked.push(kickable.id)
      await kickable.voice.kick()
    }
    // Kicked peopple, get a new one
    let getFrom = client.channels.cache.get(pickFrom).members;
    let membersToAdd = sample(getFrom, users);
    for(const member of membersToAdd){
      // Move this user into the vc
      await member.voice.setChannel(addTo);
    }

  })
}

exports.conf = {
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "next",
  description: `Moves one or more users from a vc`,
};
function sample(arr, n) {
  var result = new Set(),
      filtered = [...arr]
  while (result.size < n && filtered.length > 0) {
      var x = Math.floor(Math.random() * filtered.length);
      result.add(filtered[x])
      filtered = filtered.filter(e => !result.has(e))
  }
  return Array.from(result);
}
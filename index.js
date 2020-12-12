require('dotenv').config() // Uses the '.env' file to set process.env vars 
const Discord = require("discord.js");
const {promisify} = require('util');
const readdir = promisify(require('fs').readdir);
const klaw = require('klaw')
const path = require('path')

const client = new Discord.Client({ disableEveryone: true,  partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.prefix = "!";
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

require('./util/functions')(client);


(async () => {

    client.log('Load', 'Loading commands')
    klaw('./src/commands').on("data", (item) => {
        let category = item.path.match(/\w+(?=[\\/][\w\-\.]+$)/)[0]
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== ".js") return;
        if(category=='commands') client.log('Load', `Did not load command ${cmdFile.name.red} because it has no category`)
        else var {err} = client.loadCommand(category,`${cmdFile.name}${cmdFile.ext}`, true);
        if (err) console.log(err);
    });

    const evtFiles = await readdir('./src/events');
    client.log('Load', `Loading a total of ${evtFiles.length} events`)
    klaw('./src/events').on("data", (item) => {
        const evtFile = path.parse(item.path);
        if (!evtFile.ext || evtFile.ext !== ".js") return;
        const event = require(`./src/events/${evtFile.name}${evtFile.ext}`);
        client.on(evtFile.name, event.bind(null, client));
    });
    client.login(process.env.token);
})()
require('dotenv').config() // Uses the '.env' file to set process.env vars 
const Discord = require("discord.js");
const client = new Discord.Client({ disableEveryone: true,  partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const {promisify} = require('util');
const readdir = promisify(require('fs').readdir);
const klaw = require('klaw')
const path = require('path')
const mongoose = require('mongoose');
const Settings = require('./src/models/Settings')
if(process.env.mongodb_connection_url){
    mongoose.connect(process.env.mongodb_connection_url, {useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true});
}

client.prefix = "!";
client.commands = new Discord.Collection()
client.settings = new Discord.Collection()
client.aliases = new Discord.Collection()
client.cds = new Discord.Collection()

require('./util/functions')(client);

client.config = require('./src/config.js');

(async () => {
    client.settings.set("default", (await Settings.findOneAndUpdate({_id:"default"}, {}, {upsert:true, setDefaultsOnInsert:true, new:true})).toObject())
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
    client.levelCache = {};
    for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = client.config.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
    }
    if(!process.env.token){
        client.log(`ERROR`, `A token was not found. Please read the README.md file for instructions on how to set up the .env file`)
    }
    client.login(process.env.token);
})()
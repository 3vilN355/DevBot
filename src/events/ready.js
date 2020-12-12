const _ = require('lodash')
const moment = require('moment');
const Settings = require('../models/Settings');
module.exports = (client) => {
  updateStuff();
  async function updateStuff() {
    client.appInfo = await client.fetchApplication();
    client.settings.keyArray().forEach(async (k) => {
      let s;
      try {
        s = (await Settings.findOne({
          _id: k
        }).populate('Mentor')).toObject();
      } catch (e) {}
      if (s) {
        if (_.isEqual(client.settings.get(k), s)) return;
        if(moment(client.settings.get(k).updatedAt).add(1, 'ms').isBefore(moment(s.updatedAt))){
          // The server updated last. Grab that shit
          client.log('Fetch', `Database -> Client (${k.red})`);
          client.settings.set(k, s);
        } else {
          // The server hasn't updated. We gotta update dat bish
          let ourThing = {...client.settings.get(k)}
          delete ourThing._id
          client.log('Push', `Client -> Database (${k.red})`);
          client.settings.set(k, (await Settings.findOneAndUpdate({_id:s._id}, ourThing, {new:true})).toObject())
        }
      } else {
        client.log('Fetch', `Guild with ID:${k.red} had no config, generating`);
        client.settings.set(k, ((await (new Settings({
          _id: k
        })).save()).populate('Mentor')).toObject());
        client.log('Fetch', `Finished generating config for guild with ID:${k.red}`);
      }
    });
  }
  setInterval(updateStuff, 30000)

  client.log(`Ready`, `Bot logged in and ready to go!`)
}
const _ = require('lodash')
const moment = require('moment');
const Settings = require('../models/Settings');
module.exports = (client) => {
  updateStuff();
  async function updateStuff() {
    client.appInfo = await client.application.fetch();
    for(const [k, v] of client.settings){
      let s;
      try {
        s = (await Settings.findOne({
          _id: k
        }).populate('commands').populate('mentorRoles')).toObject();
      } catch (e) { }
      if (s) {
        if (_.isEqual(client.settings.get(k), s)) return;
        // If they're not equal, first check if the difference lies in the mentorRoles
        if (!_.isEqual(client.settings.get(k).mentorRoles, s.mentorRoles)) {
          // The mentor roles are different. Mentor roles aren't changed clientside so just set the settings to the pulled ones
          client.log('Fetch', `Database.mentorRoles -> Client.mentorRoles (${k.red})`);
          client.settings.set(k, s);
        } else {
          if (moment(client.settings.get(k).updatedAt).add(1, 'ms').isBefore(moment(s.updatedAt))) {
            // The server updated last. Grab that shit
            client.log('Fetch', `Database -> Client (${k.red})`);
            client.settings.set(k, s);
          } else {
            // The server hasn't updated. We gotta update dat bish
            let ourThing = { ...client.settings.get(k) }
            delete ourThing._id
            client.log('Push', `Client -> Database (${k.red})`);
            client.settings.set(k, (await Settings.findOneAndUpdate({ _id: s._id }, ourThing, { new: true })).toObject())
          }
        }
      } else {
        client.log('Fetch', `Guild with ID:${k.red} had no config, generating`);
        client.settings.set(k, ((await (new Settings({
          _id: k
        })).save()).populate('mentorRoles').populate('commands')).toObject());
        client.log('Fetch', `Finished generating config for guild with ID:${k.red}`);
      }
    };
  }
  setInterval(updateStuff, 3000)

  client.log(`Ready`, `Bot logged in and ready to go!`)
}
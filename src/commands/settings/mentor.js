const subcmds = ['list','add','remove','assign']
const { DiscordAPIError, MessageEmbed } = require('discord.js');
const _ = require('lodash');
const Mentor = require('../../models/Mentor');
const Settings = require('../../models/Settings');
const moment = require('moment')
require('moment-precise-range-plugin')
exports.run = async (client, message, [subcmd, ...args]) => {
  return Promise.resolve().then(async () => {
    try{
      if(message.author.permLevel < 3){
        if(client.cds.has('mentor')) return message.channel.send({embed: {color: 'RED', description: `That command is on a cooldown for another ${moment.preciseDiff(moment(client.cds.get('mentor')).add(10, 'm'), moment())}`}});
        client.cds.set('mentor', Date.now())
        setTimeout(() => {
          client.cds.delete('mentor')
        }, 600000)
        let mentorAssigned = message.settings.mentorRoles.filter(r => r.assignedChannels.includes(message.channel.id))
        if(mentorAssigned.length == 0) return
        return message.channel.send(`<@&${mentorAssigned[0].roleID}> ${[subcmd, ...args].join(' ')}`)
      }
      if(!subcmd) return message.channel.send(client.errEmb(1))
      if(!subcmds.includes(subcmd.toLowerCase())) return message.channel.send(client.errEmb(2, `Use one of the following: \`${subcmds.join('`, `')}\``))
      let i = subcmds.indexOf(subcmd.toLowerCase())
      if(i == 0){
        // They want a list. uhhh
        // Lets just map the current mentors with their roles
        return message.channel.send({embed: {
          title: `Current mentor roles!`,
          color: 'GREEN',
          fields: message.settings.mentorRoles.map(mR => { return {name: `Mentor name: ${mR.mentorName}`, value:`Role: <@&${mR.roleID}>\nChannels assigned: ${mR.assignedChannels.map(aC => `<#${aC}>`).join(`, `)}`}})
        }})
      } else if(i == 1){
        // Add a mentor thing. We need role ID and name
        if(!args.length == 2) return message.channel.send(client.errEmb(1))
        let match = args[0].match(/\d{17,19}/)
        if(!match) return message.channel.send(client.errEmb(2, `Argument 2 (\`${args[0]}\`) was not found to be a valid @role or roleID!`))
        let roleID = match[0]
        if(!message.guild.roles.cache.has(roleID)) return message.channel.send(client.errEmb(2, `Argument 2 (\`${args[0]}\`) was not found to be a valid @role or roleID!`))
        // Got the role. Now the name for the mentor role
        let mentorName = _.startCase(args[1].replace(/[^a-z]/gi, ''))
        // We got the mentor name
        // Just insert this bish i guess?
        let o = {
          mentorName,
          roleID,
          guild:message.guild.id
        }
        o = (await (new Mentor(o)).save()).toObject()
        client.settings.set(message.settings._id, (await Settings.findOneAndUpdate({_id:message.settings._id}, {$push:{mentorRoles: o._id}}, {upsert:true, setDefaultsOnInsert:true, new:true}).populate('mentorRoles').populate('commands')).toObject())
        return message.channel.send(new MessageEmbed({color: 'GREEN', description:`Successfully added <@&${roleID}> as ${mentorName} mentors`}))
      } else if(i == 2){
        // Remove a mentor thing
        // Honestly can't be arsed. If anyone wants to do this be my guest.

        // HOW-TO:
        // Find the mentioned role in message settings
        // update the Mentor db, deleting the doc with that roleID

        // The bot will automatically re-fetch the new Mentors without the mentor role within 30 sec.
      } else if(i == 3){
        // Assign a channel to a mentor
        // I guess the args here should be ...channels, mentorName?
        // We need at least 2 args
        if(!args.length == 2) return message.channel.send(client.errEmb(1))
        // Only 1 arg cannot match the channel regex
        if(args.filter(a => /@&\d{17,19}/.test(a)).length != 1) return message.channel.send(client.errEmb(2, `You need to specify which mentor type to assign these channels to (use @mentorrole)`))
        // Isolate the non-ID arg
        let mN = args.find(a => /@&\d{17,19}/.test(a))
        let found = message.settings.mentorRoles.find(mR => mR.roleID == mN.match(/\d{17,19}/)[0])
        if(!found) return message.channel.send({embed:{color:'RED', description: `No mentor type matching ${mN}`}})
        // Now that all that is done, lets just replace the old mentor assigned channels with the new ones
        let filtered = args.filter(a => /[^&]\d{17,19}/.test(a) && a != mN)
        let mapped = filtered.map(v => v.match(/\d{17,19}/)[0])
        await Mentor.updateOne({_id:found._id}, {assignedChannels: [...mapped]})
        // lets just see how this works for now
        return message.channel.send(new MessageEmbed({color: 'GREEN', description:`Successfully assigned ${mapped.map(v => `<#${v.match(/\d{17,19}/)[0]}>`).join(', ')} to ${found.mentorName} mentors`}))
      }
    }catch(e){
      client.log('err', e)
    }
  })
};


exports.conf = {
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "mentor",
    description: `Idk, does some mentor shit`,
};
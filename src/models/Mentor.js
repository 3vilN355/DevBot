const {Schema, model}= require('mongoose')

const mentorSchema = Schema({
    guild: {type: String, ref: 'Settings'},
    roleID: String,
    mentorName: String,
    assignedChannels: [
        {channelID: String}
    ]
})

module.exports = model('Mentor', mentorSchema)
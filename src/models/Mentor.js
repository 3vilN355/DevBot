const {Schema, model}= require('mongoose')

const mentorSchema = Schema({
    guild: {type: String, ref: 'Settings'},
    assignedChannels: [
        {channelID: String}
    ]
})

module.exports = model('Mentor', mentorSchema)
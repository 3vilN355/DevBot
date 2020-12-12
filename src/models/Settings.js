const {Schema, model}= require('mongoose')

const settingsSchema = Schema({
    _id: String,
    prefix: {type:String, default:'!'},
    mentorRoles: [
        { type: Schema.Types.ObjectId, ref: 'Mentor' }
    ]
})

module.exports = model('Settings', settingsSchema)
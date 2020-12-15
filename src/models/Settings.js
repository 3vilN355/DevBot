const {Schema, model}= require('mongoose')

const settingsSchema = Schema({
    _id: String,
    prefix: {type:String, default:'!'},
    mentorRoles: [
        { type: Schema.Types.ObjectId, ref: 'Mentor' }
    ],
    commands: [
        { type: Schema.Types.ObjectId, ref: 'Command' }
    ],
    roles:{
        helper: String,
        moderator: String,
        admin: String,
    }
}, {timestamps: true})

module.exports = model('Settings', settingsSchema)
const {Schema, model}= require('mongoose')

const settingsSchema = Schema({
    _id: String,
    prefix: {type:String, default:'!'},
    mentorRoles: [
        { type: Schema.Types.ObjectId, ref: 'Mentor' }
    ],
    roles:{
        helper: String,
        moderator: String,
        admin: String,
    }
}, {timestamps: true})

module.exports = model('Settings', settingsSchema)
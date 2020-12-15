const {Schema, model}= require('mongoose')

const commandSchema = Schema({
    guild: {type: String, ref: 'Settings'},
    trigger: {type: String, index:true},
    content: String,
})

module.exports = model('Command', commandSchema)
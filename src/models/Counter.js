//Untested

const {Schema, model} = require('mongoose')

const Counter = new Schema({
    _id: String,
    index: {
        type: Number,
        default: 0
    }
})

module.exports = model("Counter", Counter)
const mongoose = require("mongoose")
const templatePerson = new mongoose.Schema({
    personName:{
        type: String,
        required: true
    },
    personEmail:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Person', templatePerson, 'Person')
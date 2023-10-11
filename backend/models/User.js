const mongoose = require("mongoose")
const templateUser = new mongoose.Schema({
    userName:{
        type: String,
        required: true
    },
    userEmail:{
        type: String,
        required: true
    },
    userPassword:{
        type: String, 
        required: true
    },
    userConfirmPassword:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', templateUser, 'User')
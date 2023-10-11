const mongoose = require('mongoose');

const templateAquarium = new mongoose.Schema({
    aquariumName:{
        type: String,
        required: true
    },
    aquariumSize:{
        type: Number,
        required: true
    },
    aquariumDatePurchase:{
        type: Date,
        required: true
    },
    aquariumOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person', // Référence à la collection Person
        required: true,
    },
})

module.exports = mongoose.model('Aquarium', templateAquarium, 'Aquarium')
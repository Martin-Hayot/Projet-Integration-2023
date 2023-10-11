const mongoose = require('mongoose');

const aquariumSchema = mongoose.Schema({
    data: { type: Number, required: true },
});

module.exports = mongoose.model('Aquarium', aquariumSchema);
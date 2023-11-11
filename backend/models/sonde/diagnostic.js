const mongoose = require("mongoose");

const diagnosticSchema = mongoose.Schema({
    aquariumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Aquarium', required: true },
    date: { type: Date, required: true },
});

module.exports = mongoose.model("Diagnostic", diagnosticSchema);
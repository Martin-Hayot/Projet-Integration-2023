const mongoose = require("mongoose");

const diagnosticSchema = mongoose.Schema({
    aquariumId: { type: mongoose.ObjectId, required: true },
    date: { type: Date, required: true },
});

module.exports = mongoose.model("Diagnostic", diagnosticSchema);
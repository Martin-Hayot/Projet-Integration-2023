const mongoose = require("mongoose");

const diagnosticSchema = mongoose.Schema({
    diagnosticId: { type: String, required: true },
    aquariumId: { type: String, required: true },
    date: { type: Date, required: true },
});

module.exports = mongoose.model("Diagnostic", diagnosticSchema);
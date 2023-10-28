const mongoose = require("mongoose");

const diagnosticSchema = mongoose.Schema({
    diagnosticId: { type: String, required: true },
    measure: { type: Number, required: true },
    frequency: { type: Number, required: true },
});

module.exports = mongoose.model("Data", diagnosticSchema);
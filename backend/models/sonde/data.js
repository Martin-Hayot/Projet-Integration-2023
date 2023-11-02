const mongoose = require("mongoose");

const diagnosticSchema = mongoose.Schema({
    diagnosticId: { type: mongoose.ObjectId, required: true },
    measure: { type: Number, required: true },
    frequency: { type: Number, required: true },
});

module.exports = mongoose.model("Data", diagnosticSchema);
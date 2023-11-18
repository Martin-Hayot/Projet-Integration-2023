const mongoose = require("mongoose");

const diagnosticSchema = mongoose.Schema({
    diagnosticId: { type: mongoose.Schema.Types.ObjectId, ref: 'Diagnositc', required: true },
    measure: { type: Number, required: true },
    frequency: { type: Number, required: true },
});

module.exports = mongoose.model("Data", diagnosticSchema);
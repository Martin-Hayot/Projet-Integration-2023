const mongoose = require("mongoose");

const chemicalComponentSchema = mongoose.Schema({
	name: { type: String, required: true },
	minimumValue: { type: Number, required: true },
	maximumValue: { type: Number, required: true },
	normalFrequency: { type: Number, required: true },
});

module.exports = mongoose.model("ChemicalComponent", chemicalComponentSchema);
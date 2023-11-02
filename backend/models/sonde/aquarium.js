const mongoose = require("mongoose");

const aquariumSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
});

module.exports = mongoose.model("Aquarium", aquariumSchema);

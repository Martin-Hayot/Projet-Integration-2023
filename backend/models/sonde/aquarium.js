const mongoose = require("mongoose");

const aquariumSchema = mongoose.Schema({
	userId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
	name: { type: String, required: true },
});

module.exports = mongoose.model("Aquarium", aquariumSchema);

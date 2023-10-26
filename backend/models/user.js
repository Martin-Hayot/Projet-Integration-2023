const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	refreshToken: [String],
	authType: { type: String, default: "local" },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);

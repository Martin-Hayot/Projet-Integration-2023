const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
	message: { type: String, required: true },
	archived: { type: Boolean, default: false, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

module.exports = mongoose.model("Ticket", ticketSchema);

const mongoose = require("mongoose");
const Ticket = require("./ticket");

const categorySchema = mongoose.Schema({
	label: { type: String, required: true },
});

categorySchema.pre("remove", async function (next) {
	try {
		console.log("Category removed from tickets");
		await Ticket.remove({ categoryId: this._id }).exec();
		next();
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = mongoose.model("Category", categorySchema);

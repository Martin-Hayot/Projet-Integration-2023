const router = require("express").Router();
const { Ticket, Category } = require("../models");
const { requireUser, requireAdmin } = require("../middleware");

router.post("/", requireUser, async (req, res) => {
	try {
		if (!req.body.message)
			return res.status(400).json({
				message: "Bad Request - Message is required",
			});

		if (req.body.categoryId) {
			const searchedCategory = await Category.findOne({
				_id: req.body.categoryId,
			});
			if (!searchedCategory) {
				return res.status(404).json({
					message: "Not Found - Category",
				});
			}
		}
		const ticketsCreatedByUser = await Ticket.find({
			userId: req.user.userId,
			archived: false,
		});
		if (ticketsCreatedByUser.length < 5) {
			let ticket = new Ticket({
				message: req.body.message,
				userId: req.user.userId,
				...(req.body.categoryId ? { categoryId: req.body.categoryId } : null),
			});
			const newTicket = await Ticket.create(ticket);
			return res.status(201).json({
				message: "Ticket created successfully",
				ticket: newTicket,
			});
		} else {
			return res.status(401).json({
				message:
					"Unauthorized - You have reached the maximum number of tickets",
			});
		}
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: e });
	}
});

router.post("/archive/:id/", requireAdmin, async (req, res) => {
	try {
		const updatedTicket = await Ticket.findByIdAndUpdate(
			req.params.id,
			{
				archived: true,
			},
			{ new: true }
		);

		if (!updatedTicket) {
			return res.status(404).json({ message: "Not Found - Ticket ID" });
		}
		res
			.status(200)
			.json({ message: "Ticket updated successfully", ticket: updatedTicket });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e });
	}
});

router.get("/", requireAdmin, async (req, res) => {
	try {
		const tickets = await Ticket.find({
			archived: false,
		});

		res
			.status(200)
			.json({ message: "Tickets sent successfully", tickets: tickets });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e });
	}
});

router.get("/archived/", requireAdmin, async (req, res) => {
	try {
		const tickets = await Ticket.find({
			archived: true,
		});

		res
			.status(200)
			.json({ message: "Tickets sent successfully", tickets: tickets });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e });
	}
});

router.get("/user/", requireUser, async (req, res) => {
	try {
		const userTickets = await Ticket.find({
			userId: req.user.userId,
			archived: false,
		});

		res
			.status(200)
			.json({ message: "Tickets sent successfully", tickets: userTickets });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e });
	}
});

router.get("/:id", requireAdmin, async (req, res) => {
	try {
		const ticket = await Ticket.findById(req.params.id);
		res
			.status(200)
			.json({ message: "Ticket sent successfully", ticket: ticket });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e });
	}
});

router.delete("/:id", requireAdmin, async (req, res) => {
	try {
		const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
		if (!deletedTicket) {
			return res.status(404).json({ message: "Not Found - Ticket ID" });
		}
		res
			.status(200)
			.json({ message: "Ticket deleted successfully", ticket: deletedTicket });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e });
	}
});

module.exports = router;

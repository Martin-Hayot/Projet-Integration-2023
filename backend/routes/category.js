const router = require("express").Router();
const { Category, Ticket } = require("../models");
const { requireAdmin, requireUser } = require("../middleware");

router.post("/", requireAdmin, async (req, res) => {
	if (!req.body.label)
		return res.status(400).json({ message: "Bad Request - Label Required" });

	try {
		let category = new Category({
			label: req.body.label,
		});
		const newCategory = await Category.create(category);
		res.status(201).json({
			message: "Category created successfully",
			category: newCategory,
		});
	} catch (e) {
		console.error(e);
		res.status(500).json(e);
	}
});

router.get("/", async (req, res) => {
	try {
		const searchedCategories = await Category.find();
		res
			.status(200)
			.json({ message: "Categories sent", categories: searchedCategories });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e });
	}
});

router.get("/search/:label/", requireAdmin, async (req, res) => {
	try {
		const searchedCategories = await Category.find({
			label: { $regex: req.params.label, $options: "i" },
		});
		res
			.status(200)
			.json({ message: "Categories sent", categories: searchedCategories });
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e });
	}
});

router.get("/:id", requireUser, async (req, res) => {
	try {
		const searchedCategory = await Category.findById(req.params.id);
		if (!searchedCategory) {
			return res.status(404).json({ message: "Not Found - Category ID" });
		}
		res.status(200).json({
			message: "Category sent successfully",
			category: searchedCategory,
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e });
	}
});

router.delete("/:id", requireAdmin, async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category) {
			return res.status(404).json({ message: "Not Found - Category ID" });
		}
		await Ticket.updateMany(
			{ categoryId: req.params.id },
			{ $unset: { categoryId: 1 } }
		);
		const deletedCategory = await Category.findByIdAndDelete(req.params.id);
		if (!deletedCategory) {
			return res.status(404).json({ message: "Not Found - Category ID" });
		}

		res.status(200).json({
			message: "Category deleted successfully",
			category: deletedCategory,
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e });
	}
});

module.exports = router;

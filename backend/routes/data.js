const express = require("express");
const router = express.Router();
const { requireUser } = require("../middleware/auth");
const AquariumData = require("../models/sonde/data");

router.post("/", requireUser, async (req, res) => {
	const { diagnosticId } = req.body;
	const { measure } = req.body;
	const { frequency } = req.body;
	if (!diagnosticId || !measure || !frequency) {
		return res.status(400).json({ message: "All entries are required" });
	}
	const aquariumData = new AquariumData({
		diagnosticId,
		measure,
		frequency,
	});

	try {
		await aquariumData.save();
		res.status(201).json({ message: "Data created successfully" });
	} catch (e) {
		console.log("Error : ", e);
		res.status(500).json({ message: e });
	}
});

router.get("/", requireUser, async (req, res) => {
	const { diagnosticId } = req.body;
	await AquariumData.find({ diagnosticId: diagnosticId })
		.then((aquariumData) => res.status(200).json(aquariumData))
		.catch((error) => res.status(400).json({ error }));
});

module.exports = router;

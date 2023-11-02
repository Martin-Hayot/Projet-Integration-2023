const express = require("express");
const router = express.Router();
const { requireUser } = require("../middleware/auth");
const AquariumData = require("../models/sonde/data");

router.post("/", requireUser, (req, res, next) => {
	const aquariumData = new AquariumData({
		...req.body,
	});
	aquariumData
		.save()
		.then(() => res.status(201).json({ message: "Data enregistré !" }))
		.catch((error) => res.status(400).json({ error }));
});

router.get("/", requireUser, (req, res, next) => {
	const diagnosticId = req.body.diagnosticId;
	AquariumData.find({ diagnosticId: diagnosticId })
		.then((aquariumData) => res.status(200).json(aquariumData))
		.catch((error) => res.status(400).json({ error }));
});

module.exports = router;

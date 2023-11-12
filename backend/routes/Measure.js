const express = require("express");
const router = express.Router();
const AquariumData = require("../models/Measure");

router.post("/createData", (req, res) => {
	const aquariumData = new AquariumData({
		...req.body,
	});
	aquariumData
		.save()
		.then(() => res.status(201).json({ message: "Data enregistré !" }))
		.catch((error) => res.status(400).json({ error }));
});

router.get("/oneData", (req, res) => {
	AquariumData.findOne({_id:req.params.id })
		.then((aquariumData) => res.status(200).json(aquariumData))
		.catch((error) => res.status(400).json({ error }));
});

router.get("/AllData", (req, res) => {
	AquariumData.find()
		.then((aquariumData) => res.status(200).json(aquariumData))
		.catch((error) => res.status(400).json({ error }));
});
module.exports = router;


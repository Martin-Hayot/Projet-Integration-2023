const express = require("express");
const router = express.Router();
const AquariumDiagnostic = require("../models/sonde/diagnostic");

router.post("/createDiagnostic", (req, res) => {
	const aquariumDiagnostic = new AquariumDiagnostic({
		...req.body,
	});
	aquariumDiagnostic
		.save()
		.then(() => res.status(201).json({ message: "Diagnostic enregistré !" }))
		.catch((error) => res.status(400).json({ error }));
});

router.get("/oneDiagnostic", (req, res) => {
	AquariumDiagnostic.findOne({_id:req.params.id })
		.then((aquariumDiagnostic) => res.status(200).json(aquariumDiagnostic))
		.catch((error) => res.status(400).json({ error }));
});

router.get("/AllDiagnostic", (req, res) => {
	AquariumDiagnostic.find()
		.then((aquariumDiagnostic) => res.status(200).json(aquariumDiagnostic))
		.catch((error) => res.status(400).json({ error }));
});
module.exports = router;

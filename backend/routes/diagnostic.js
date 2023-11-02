const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { requireUser } = require("../middleware/auth");
const AquariumDiagnostic = require("../models/sonde/diagnostic");

router.post("/", requireUser, (req, res, next) => {
    const aquariumDiagnostic = new AquariumDiagnostic({
        ...req.body,
    });
    aquariumDiagnostic
        .save()
        .then(() => res.status(201).json({ message: "Data enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
});

router.get("/", requireUser, (req, res, next) => {
    const aquariumId = req.body.aquariumId;
    AquariumDiagnostic.find({ aquariumId: aquariumId })
        .then((aquariumDiagnostic) => res.status(200).json(aquariumDiagnostic))
        .catch((error) => res.status(400).json({ error }));
});

module.exports = router;
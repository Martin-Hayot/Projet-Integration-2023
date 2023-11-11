const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const { requireUser } = require("../middleware/auth");
const AquariumDiagnostic = require("../models/sonde/diagnostic");

router.post("/", requireUser, async (req, res) => {
    const { aquariumId } = req.body;
    const { date } = req.body;
    if (!aquariumId || !date) {
        return res.status(400).json({ message: "All entries are required" });
    }
    const aquariumDiagnostic = new AquariumDiagnostic({
        aquariumId,
        date,
    });

    try {
        await aquariumDiagnostic.save();
        res.status(201).json({ message: "Diagnostic created successfully" });
    } catch (e) {
        console.log("Error : ", e);
        res.status(500).json({ message: e });
    }
});

router.get("/", requireUser, async (req, res) => {
    const { aquariumId } = req.body;
    await AquariumDiagnostic.find({ aquariumId: aquariumId })
        .then((aquariumDiagnostic) => res.status(200).json(aquariumDiagnostic))
        .catch((error) => res.status(400).json({ error }));
});

module.exports = router;
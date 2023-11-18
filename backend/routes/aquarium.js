const express = require("express");
const router = express.Router();
const { requireUser } = require("../middleware/auth");
const Aquarium = require("../models/sonde/aquarium");
const AquariumDiagnostic = require("../models/sonde/diagnostic");
const AquariumData = require("../models/sonde/data");


router.post("/", requireUser, async (req, res) => {
    const { userId } = req.user;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "All entries are required" });
    }
    const aquarium = new Aquarium({
        userId,
        name,
    });
    try {
        await aquarium.save();
        res.status(201).json({ message: "Aquarium created successfully" });
    } catch (e) {
        console.log("Error : ", e);
        res.status(500).json({ message: e });
    }
});

router.get("/", requireUser, async (req, res) => {
    const { userId } = req.user;
    await Aquarium.find({ userId: userId })
        .then((aquarium) => res.status(200).json(aquarium))
        .catch((error) => res.status(400).json({ error }));
});

router.post("/diagnostic/", requireUser, async (req, res) => {
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

router.get("/:aquariumId/diagnostic/", requireUser, async (req, res) => {
    const aquariumId = req.params.aquariumId;
    await AquariumDiagnostic.find({ aquariumId: aquariumId })
        .then((aquariumDiagnostic) => res.status(200).json(aquariumDiagnostic))
        .catch((error) => res.status(400).json({ error }));
});

router.post("/diagnostic/data/", requireUser, async (req, res) => {
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

router.get("/:aquariumId/diagnostic/:diagnosticId/data", requireUser, async (req, res) => {
    const aquariumId = req.params.aquariumId;
    const diagnosticId = req.params.diagnosticId;
    await AquariumDiagnostic.find({ aquariumId: aquariumId })
        .then(
            await AquariumData.find({ diagnosticId: diagnosticId })
                .then((aquariumData) => res.status(200).json(aquariumData))
                .catch((error) => res.status(400).json({ error }))
        )
        .catch((error) => res.status(400).json({ error }))
});

module.exports = router;

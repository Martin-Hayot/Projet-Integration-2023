const express = require("express");
const router = express.Router();

const AquariumDiagnostic = require("../models/sonde/diagnostic");

router.post("/", (req, res, next) => {
    const aquariumDiagnostic = new AquariumDiagnostic({
        ...req.body,
    });
    aquariumDiagnostic
        .save()
        .then(() => res.status(201).json({ message: "Data enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
});

router.get("/", (req, res, next) => {
    AquariumDiagnostic.find()
        .then((aquariumDiagnostic) => res.status(200).json(aquariumDiagnostic))
        .catch((error) => res.status(400).json({ error }));
});

module.exports = router;
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const AquariumDiagnostic = require("../models/Diagnostic");
const { response } = require("../app");

router.post("/createDiagnostic", (req, res) => {
    const aquariumDiagnostic = new AquariumDiagnostic({
        ...req.body,
    });
    aquariumDiagnostic
        .save()
        .then(() => res.status(201).json({ message: "Diagnostic enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
});

router.get("OneDiagnostic/:id", (req, res) => {
    AquariumDiagnostic.findOne({ _id: req.params.id })
        .then((aquariumDiagnostic) => res.status(200).json(aquariumDiagnostic))
        .catch((error) => res.status(400).json({ error }));
});


router.get("/allDiagnostic", (req, res)=>{
    AquariumDiagnostic.find()
        .then((AquariumDiagnostic) =>{
            res.status(200).json(AquariumDiagnostic)})
        .catch((error)=>{
            res.status(400).json({error:error})
        })
})

module.exports = router;


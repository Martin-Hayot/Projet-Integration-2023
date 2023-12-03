const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const AquariumReport = require("../models/sonde/report");

router.post("/createReport", (req, res) => {
    const aquariumReport = new AquariumReport({
        ...req.body,
    });
    aquariumReport
        .save()
        .then(() => res.status(201).json({ message: "Report enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
});

router.get("OneReport/:id", (req, res) => {
    AquariumReport.findOne({ _id: req.params.id })
        .then((aquariumReport) => res.status(200).json(aquariumReport))
        .catch((error) => res.status(400).json({ error }));
});


router.get("/allReport", (req, res)=>{
    AquariumReport.find()
        .then((AquariumReport) =>{
            res.status(200).json(AquariumReport)})
        .catch((error)=>{
            res.status(400).json({error:error})
        })
})

module.exports = router;

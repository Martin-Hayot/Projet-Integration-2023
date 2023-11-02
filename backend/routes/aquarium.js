const express = require("express");
const router = express.Router();
const { requireUser } = require("../middleware/auth");
const Aquarium = require("../models/sonde/aquarium");

router.post("/", requireUser, (req, res, next) => {
    const aquarium = new Aquarium({
        ...req.body,
    });
    aquarium
        .save()
        .then(() => res.status(201).json({ message: "Data enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
});

router.get("/", requireUser, (req, res, next) => {
    const { email } = req.user;
    Aquarium.find({ userId: email })
        .then((aquarium) => res.status(200).json(aquarium))
        .catch((error) => res.status(400).json({ error }));
});

module.exports = router;

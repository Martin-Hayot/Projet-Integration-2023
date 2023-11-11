const express = require("express");
const router = express.Router();
const { requireUser } = require("../middleware/auth");
const Aquarium = require("../models/sonde/aquarium");

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

module.exports = router;

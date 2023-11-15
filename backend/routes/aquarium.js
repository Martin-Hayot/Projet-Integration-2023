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

// Nouvelle route pour la suppression d'un aquarium
router.delete("/delete", requireUser, async (req, res) => {
    const { userId } = req.user;
    const { aquariumId } = req.body;

    if (!aquariumId) {
        return res.status(400).json({ message: "no aquarium" });
    }

    try {
        const deletedAquarium = await Aquarium.findOneAndDelete({
            _id: aquariumId,
            userId: userId,
        });

        if (!deletedAquarium) {
            return res.status(404).json({ message: "Aquarium not found" });
        }

        res.status(200).json({ message: "Aquarium deleted successfully" });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: error });
    }
});

module.exports = router;

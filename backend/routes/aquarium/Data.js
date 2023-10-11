const express = require("express");
const router = express.Router();

const Aquarium = require('../.././models/aquarium');

router.post('/', (req, res, next) => {
    const aquarium = new Aquarium({
        ...req.body
    });
    aquarium.save()
        .then(() => res.status(201).json({ message: 'Data enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

router.get('/', (req, res, next) => {
    Aquarium.find()
        .then(aquarium => res.status(200).json(aquarium))
        .catch(error => res.status(400).json({ error }));
});

module.exports = router;
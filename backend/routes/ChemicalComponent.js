const express = require("express");
const router = express.Router();
const ChemicalComponent = require("../models/ChemicalComponenent");

// Liste des composants chimiques
router.get("/", (req, res) => {
    ChemicalComponent.find()
        .then((chemicalComponents) => res.status(200).json(chemicalComponents))
        .catch((error) => res.status(400).json({ error })); 
});

// Recherche d'un composant chimique
router.get("/:id", (req, res) => {
  ChemicalComponent.findOne({ _id: req.params.id })
  .then((chemicalComponent) => {
    if (chemicalComponent) {
      res.status(200).json(chemicalComponent);
    } else {
      res.status(404).json({ message: "Le composant est introuvable" });
    }
  })
  .catch((error) => res.status(400).json({ error }));
});

// Créer un composant chimique
router.post("/", (req, res) => {
  const component = new ChemicalComponent({
    name: req.body.name,
    minimumValue: req.body.minimumValue,
    maximumValue: req.body.maximumValue,
    normalFrequency: req.body.normalFrequency,
  });

  component
    .save()
    .then(() => res.status(201).json({ message: "Composant enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

// Mise à jour d'un composant chimique
router.put("/:id", (req, res) => {
    ChemicalComponent.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            minimumValue: req.body.minimumValue,
            maximumValue: req.body.maximumValue,
            normalFrequency: req.body.normalFrequency,
        },
        { new: true } // renvoie le document mis à jour
    )
    .then((updatedComponent) => {
        res.status(200).json({ message: 'Composant chimique mis à jour', updatedComponent });
    })
    .catch((error) => {
        res.status(404).json({ error });
    });
});

// Supprimer un composant chimique
router.delete("/:id", (req, res) => {
  ChemicalComponent.deleteOne({ _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Composant chimique supprimé avec succès !' }))
  .catch((error) => res.status(400).json({ error }));
});

module.exports = router;

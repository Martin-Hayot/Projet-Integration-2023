const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Aquarium = require('../models/Aquarium')
const mongoose = require('mongoose')

// Recherche des aquariums d'un utilisateur
router.get('/aquarium/:userId', (req, res) => {
  const userId = req.params.userId;

  Aquarium.find({ user: userId })
    .then(aquariums => {
      if (aquariums.length === 0) {
        res.status(404).json({ message: 'Aucun aquarium trouvé pour cet utilisateur' });
      } else {
        // Renvoie la liste des noms d'aquariums
        const aquariumNames = aquariums.map(aquarium => aquarium.name);
        res.status(200).json(aquariumNames);
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Erreur interne du serveur lors de la récupération des aquariums' });
    });
});

// Recherche d'un utilisateur
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  User.findOne({ _id: userId }, 'firstname lastname email')
    .then(userInfo => {
      if (!userInfo) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      } else {
        res.status(200).json(userInfo);
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    });
});

module.exports = router;

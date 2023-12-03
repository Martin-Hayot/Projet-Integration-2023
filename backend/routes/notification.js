// Import des modules nécessaires
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Aquarium = require('../models/sonde/aquarium');
const { response } = require('../app');

// Recherche des aquariums d'un utilisateur
router.get('/aquarium/:userId', (req, res) => {
  const userId = req.params.userId;

  Aquarium.find({ userId: userId })
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

  router.get('/notifications/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      // Étape 1: Récupérer les informations de l'utilisateur
      const userInfo = await User.findOne({ _id: userId }, 'firstname lastname email');
      if (!userInfo) {
        return res.status(404).json();
      }
  
      // Étape 2: Récupérer les aquariums de l'utilisateur
      const aquariums = await Aquarium.find({ user: userId });
      if (aquariums.length === 0) {
        return res.status(404).json({ message: 'Aucun aquarium trouvé pour cet utilisateur' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  });
  
  module.exports = router;
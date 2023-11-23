// Import des modules nécessaires
const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const User = require('../models/user');
const Aquarium = require('../models/Aquarium');
const Diagnostic = require('../models/Diagnostic');
const ChemicalComponent = require('../models/ChemicalComponent');
const Measure = require('../models/Measure');

// Créez une instance de la classe Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Fonction pour envoyer un e-mail
const sendMail = async (mailOptions) => {
  try {
    await resend.emails.send(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Définition des routes
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
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Étape 2: Récupérer les aquariums de l'utilisateur
    const aquariums = await Aquarium.find({ user: userId });
    if (aquariums.length === 0) {
      return res.status(404).json({ message: 'Aucun aquarium trouvé pour cet utilisateur' });
    }

    // Étape 3-5: Vérifie les composants et envoi des notifications et mail
    const notifications = [];

    const processAquariums = async () => {
      for (const aquarium of aquariums) {
        const mesures = await Measure.find({ aquarium: aquarium._id });

        for (const mesure of mesures) {
          const diagnostics = await Diagnostic.find({ mesure: mesure._id });

          for (const diagnostic of diagnostics) {
            let status = false;
            const component = await ChemicalComponent.findOne({ _id: diagnostic.chemicalComponent });

            if (diagnostic.Measure >= component.minimumValue && diagnostic.Measure <= component.maximumValue) {
              const notificationMessage = `${aquarium.name} est en parfait état. Bravo !`;
              notifications.push({ aquarium: aquarium.name, component: component.name, message: notificationMessage });
              status = true;
            } else {
              if (diagnostic.Measure < component.minimumValue) {
                const missingAmount = component.minimumValue - diagnostic.Measure;
                const notificationMessage = `Il manque ${missingAmount} g/L pour le composant ${component.name} pour ${aquarium.name}`;
                notifications.push({ aquarium: aquarium.name, component: component.name, message: notificationMessage });
              } else {
                const excessAmount = diagnostic.Measure - component.maximumValue;
                const notificationMessage = `Le composant ${component.name} est supérieur de ${excessAmount} g/L pour ${aquarium.name}`;
                notifications.push({ aquarium: aquarium.name, component: component.name, message: notificationMessage });
              }
            }
            // Si c'est anormal, envoie un e-mail
            if (!status && notifications.length > 0) {
            const lastNotification = notifications[notifications.length - 1];// Récupérer la dernière notification
            const notificationMessage = lastNotification.message;

            await sendMail({
              from: 'onboarding@resend.dev',
              to: userInfo.email,
              subject: 'État anormal de l\'aquarium',
              html: `<p>${notificationMessage}</p>`
            });
            }
          }
        }
      }
    };

    // Commencer le traitement des aquariums
    await processAquariums();

    // Toutes les aquariums ont été traitées, renvoyer la réponse
    return res.status(200).json({ user: userInfo, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;

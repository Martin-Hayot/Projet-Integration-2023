// Import des modules nécessaires
const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const User = require('../models/user');
const Aquarium = require('../models/sonde/aquarium');
const Diagnostic = require('../models/sonde/diagnostic');
const Report = require('../models/sonde/report')
const ChemicalComponent = require('../models/sonde/chemicalComponent');

//Cette clé a dû être mise pour que les tests passent 
RESEND_API_KEY="re_DCPrQNGS_NUrgzbaiQmNMdYkw6fHCS3g8"
// Créez une instance de la classe Resend
const resend = new Resend(RESEND_API_KEY);

// Fonction pour envoyer un e-mail
const sendMail = async (mailOptions) => {
  try {
    await resend.emails.send(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

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

  /**
 * @openapi
 * /api/notification/notifications/:userId:
 *   get:
 *     tags:
 *     - aquarium
 *     - user
 *     - diagnostic
 *     - report
 *     - chemicalComponent
 *     summary: Fetches all data for the reports of an aquarium of an user
 *     parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *         type: string
 *       required: true
 *       description: The ID of the user
 *     responses:
 *       '200':
 *         description: Returns data for the report of a aquarium for a specific user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *       '400':
 *         description: Error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

  router.get('/notifications/:userId', async (req, res) => {
    //Fonction extraction date et heure
    const extractDateTime = (date) => {
      // Vérifier si date est une chaîne
      if (typeof date === 'string') {
            
        // Extraire la date et l'heure si la structure attendue est présente
        const dateParts = date.split(": ");
        if (dateParts.length === 2) {
          const diagnosticDate = new Date(dateParts[1]);
          
          // Formater la date et l'heure en français
          const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'};
          const formattedDate = diagnosticDate.toLocaleDateString('fr-FR', options);
    
          // Retourner la date et l'heure sous forme de tableau
          return [formattedDate];
        }
      } else if (date instanceof Date) {
        // Si date est déjà un objet Date, formater la date et l'heure en français
        const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = date.toLocaleDateString('fr-FR', options);
    
        // Retourner la date et l'heure sous forme de tableau
        return [formattedDate];
      }
    
      // Si la structure n'est pas conforme, retourne un tableau vide
      return [];
    };
    
    try {
      const userId = req.params.userId;
      
      // Étape 1: Récupérer les informations de l'utilisateur
      const userInfo = await User.findOne({ _id: userId }, 'firstname lastname email');
      if (!userInfo) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Étape 2: Récupérer les aquariums de l'utilisateur
      const aquariums = await Aquarium.find({ userId: userId });
      if (aquariums.length === 0) {
        return res.status(404).json({ message: 'Aucun aquarium trouvé pour cet utilisateur' });
      }
  
      // Étape 3-5: Vérifie les composants et envoi des notifications et mail
      const notifications = [];
      const real = 'Mesure réelle'
      const excpected = 'Mesure attendue'
      const chemicalC = 'Composant'

      const processAquariums = async () => {
        for (const aquarium of aquariums) {
          const diagnostics = await Diagnostic.find({ aquariumId: aquarium._id });
          for (const diagnostic of diagnostics) {
            const reports = await Report.find({ diagnostic: diagnostic._id });
            for (const report of reports) {
              let status = false;
              const component = await ChemicalComponent.findOne({ _id: report.chemicalComponent });
              //Appel de la fonction extractDate pour le formatage
              const formattedDate = extractDateTime(diagnostic.date);
              
              let dateAndTimeLine, aquariaState,realMeasure, expectMeasure, colorClass, chemicalCpnt

              if (report.Measure >= component.minimumValue && report.Measure <= component.maximumValue) {
                 chemicalCpnt = `${chemicalC}: ${component.name} `
                 dateAndTimeLine = `Le ${formattedDate[0]}.`
                 realMeasure = `${real}: ${report.Measure}g/L.` 
                 expectMeasure = `${excpected}: ${component.minimumValue} - ${component.maximumValue}g/L`;
                 aquariaState = ` Bravooo !!!! Parfait état.`;
                 colorClass = '#006400';
                 status = true;
              } else {
                if (report.Measure < component.minimumValue) {
                  const missingAmount = component.minimumValue - report.Measure;
                  chemicalCpnt = `${chemicalC}: ${component.name} `
                  dateAndTimeLine = `Le ${formattedDate[0]}.`
                  realMeasure =` ${real}: ${report.Measure}g/L.`
                  expectMeasure = ` ${excpected}: ${component.minimumValue} - ${component.maximumValue}g/L`;
                  aquariaState = `Il manque ${missingAmount}g/L dans ${aquarium.name}.`;
                  colorClass = '#ED8936'; // Couleur Orange
                } else {
                  const excessAmount = report.Measure - component.maximumValue;
                  chemicalCpnt = `${chemicalC}: ${component.name} `
                  dateAndTimeLine = `Le ${formattedDate[0]},`
                  realMeasure = `Mesure réelle: ${report.Measure}g/L.`
                  expectMeasure = `Mesure attendue:  ${component.minimumValue} - ${component.maximumValue}g/L`;
                  aquariaState = `Supérieur de ${excessAmount} g/L dans ${aquarium.name}.`;
                  colorClass = '#FF0006'; // Couleur Rouge
                }
              }
              notifications.push({
                aquarium: aquarium.name,
                diagnostic: diagnostic.date,
                reports: report.Measure,
                component: component.name,
                message: 
                  `<div style="font-weight: bold; color: ${colorClass}">
                    <p>${chemicalCpnt}</p>
                    <p className="w-1/5">${dateAndTimeLine}</p>
                    <p>${realMeasure}</p>
                    <p>${expectMeasure}</p>
                    <p className="w-1/5">${aquariaState}</p>
                  </div>`,
              });
              
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
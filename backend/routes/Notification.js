const express = require('express');
const router = express.Router();
const Aquarium = require('../models/Aquarium')
const User = require('../models/user')



// Affiche la liste des aquarium d'un utilisateur
router.get('/api/listAquarium/email/:email', (req, res =>{
    Aquarium.find({user:_id})
    .then(())
}))
/*
router.get("/oneData", (req, res) => {
	AquariumData.findOne({_id:req.params.id })
		.then((aquariumData) => res.status(200).json(aquariumData))
		.catch((error) => res.status(400).json({ error }));
});


*/

// Assume que vous avez déjà défini vos modèles User, Mesure, ChemicalComponent, et Diagnostic
router.get('/api/notification/email/:email/aquarium/:nomAquarium/',(req, res) => {
    const email = req.params.email; 
    const nomAquarium = req.params.nomAquarium; 

User.aggregate([
  // Filtrer par email
  { $match: { email: email } },

  // Joindre avec la collection Aquarium pour obtenir le nom de l'aquarium
  {
    $lookup: {
      from: 'aquariums',
      localField: '_id',
      foreignField: 'user',
      as: 'aquariums',
    },
  },

  // Aplatir le tableau d'aquariums
  { $unwind: '$aquariums' },

  // Filtrer par nom d'aquarium si le paramètre est fourni
  nomAquarium
    ? { $match: { 'aquariums.name': nomAquarium } }
    : { $match: {} },

  // Joindre avec la collection Mesure pour obtenir la date et l'heure de la mesure
  {
    $lookup: {
      from: 'mesures',
      localField: 'aquariums._id',
      foreignField: 'aquarium',
      as: 'mesures',
    },
  },

  // Aplatir le tableau de mesures
  { $unwind: '$mesures' },

  // Joindre avec la collection ChemicalComponent pour obtenir les valeurs minimales et maximales
  {
    $lookup: {
      from: 'chemicalcomponents',
      localField: 'mesures.aquarium',
      foreignField: 'aquarium',
      as: 'chemicalComponents',
    },
  },

  // Aplatir le tableau de composants chimiques
  { $unwind: '$chemicalComponents' },

  // Calcul des valeurs nécessaires
  {
    $project: {
      _id: 0, // Exclure le champ _id
      firstname: 1,
      lastname: 1,
      email: 1,
      name: '$aquariums.name',
      Date: '$mesures.dateHeure',
      lower: { $subtract: ['$mesures.aquarium', '$chemicalComponents.minimumValue'] },
      high: { $subtract: ['$mesures.aquarium', '$chemicalComponents.maximumValue'] },
      difFrequency: { $subtract: ['$mesures.aquarium', '$chemicalComponents.normalFrequency'] },
    },
  },

  // Filtrer les résultats où la fréquence est au-dessus de la normale
   // Filtrer les résultats où la fréquence est au-dessus ou en dessous de la normale
   {
    $match: {
      $or: [
        { high: { $gt: 0 } }, // Fréquence au-dessus de la normale
        { difFrequency: { $gt: 0 } }, // Fréquence au-dessus de la normale
        { lower: { $lt: 0 } }, // Fréquence en dessous de la normale
      ],
    },
  },
])
  .then((result) => {
    // Traiter les résultats ici et afficher les notifications sur votre page
    console.log(result);

    // Affichage des notifications
    const notifications = result.map(({name, Date, lower, high, difFrequency, component }) => {
      if (high > 0) {
        return `Le composant ${component} de l'aquarium ${name} est au-dessus de la normale de ${high}`;
      } else if (difFrequency > 0) {
        return `La fréquence du composant ${component} dans l'aquarium ${name} est au-dessus de la normale le ${Date}`;
      } else {
        return `Le composant ${component} de l'aquarium ${name} est en dessous de la normale de ${lower}`;
      }
    });

    // Envoyer les notifications en tant que réponse JSON
    res.json(notifications);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  });
});

module.exports = router;
const mongoose = require("mongoose");

const TemplateMesure = new mongoose.Schema({
  mesureAquarium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aquarium', // Référence à la collection Aquarium
    required: true,
  },
  mesureComponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChemicalComponent', // Référence à la collection ComposantChimique
    required: true,
  },
  mesureDate: {
    type: Date,
    required: true,
  },
  MesureTime: {
    type: Number,
    required: true,
  },
  mesureValue: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Mesure', templateMesure, 'Mesure');

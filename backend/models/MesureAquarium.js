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
  mesureTime: {
    type: String,
    required: true,
  },
  mesureValue: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Mesure', TemplateMesure, 'Mesure');

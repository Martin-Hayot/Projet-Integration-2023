const mongoose = require("mongoose");

const TemplateChemicalComponent = new mongoose.Schema({
  chemicalComponentName: {
    type: String,
    required: true,
  },
  chemicalComponentMinumumValue: {
    type: Number,
    required: true,
  },
  chemicalComponentMaximumValue: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('ChemicalComponent', TemplateChemicalComponent, 'ChemicalComponent');

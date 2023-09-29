const mongoose = require("mongoose");

const TemplateChemicalComponent = new mongoose.Schema({
  chemicalComponentName: {
    type: String,
    required: true,
  },
  chemicalComponentMesureValue: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('ChemicalComponent', TemplateChemicalComponent, 'ChemicalComponent');

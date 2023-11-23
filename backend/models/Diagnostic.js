const mongoose = require("mongoose");

const diagnosticSchema = mongoose.Schema({
    mesure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mesure', // référence la collection des mesures
        required: true,
      },
    chemicalComponent:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChemicalComponent', // référence la collection des composants chimiques
      required: true,
    },
    Measure: {
      type: Number,
      required: true,
    },
    Frequency:{
      type: Number,
      required: true,
    }
});

// Index composite sur mesure et chemicalComponent
diagnosticSchema.index({ mesure: 1, chemicalComponent: 1 }, { unique: true });

module.exports = mongoose.model("Diagnostic", diagnosticSchema);


const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    diagnostic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diagnostic', // référence la collection des diagnostics
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

module.exports = mongoose.model("Report", reportSchema);

const mongoose = require("mongoose");

const mesureSchema = mongoose.Schema({
  aquarium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Aquarium", 
    required: true,
  },
  dateHeure: {
    type: Date,
    default: Date.now, // La date et l'heure seront définies automatiquement lors de la création
  }
});

module.exports = mongoose.model("Mesure", mesureSchema);

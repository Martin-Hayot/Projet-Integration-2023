const mongoose = require('mongoose');

const aquariumSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // référence à la collection des utilisateurs
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Aquarium', aquariumSchema);

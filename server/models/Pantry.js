
const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ingredients: {
    type: [String], 
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Pantry', pantrySchema);

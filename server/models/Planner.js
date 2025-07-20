const mongoose = require('mongoose');

const plannerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // e.g., "2025-07-21"
    required: true
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Planner', plannerSchema);

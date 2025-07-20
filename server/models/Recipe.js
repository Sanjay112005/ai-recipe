const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: "",
    trim: true
  },
  ingredients: {
    type: [String],
    required: true,
    validate: arr => arr.length > 0
  },
  instructions: {
    type: [String],
    required: true,
    validate: arr => arr.length > 0
  },
  image: {
    type: String,
    default: ""
  },
  source: {
    type: String,
    enum: ["AI-generated", "user-generated"],
    default: "AI-generated"
  }
}, { timestamps: true });

module.exports = mongoose.model("Recipe", recipeSchema);

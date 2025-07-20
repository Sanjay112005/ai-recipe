// controllers/pantryController.js
const Pantry = require('../models/Pantry');

const getPantry = async (req, res) => {
  try {
    const pantry = await Pantry.findOne({ userId: req.user._id });

    if (!pantry) return res.status(404).json({ message: 'Pantry not found' });

    res.json(pantry.ingredients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updatePantry = async (req, res) => {
  const { ingredients } = req.body;

  if (!Array.isArray(ingredients)) {
    return res.status(400).json({ message: 'Ingredients must be an array' });
  }

  try {
    const updatedPantry = await Pantry.findOneAndUpdate(
      { userId: req.user._id },
      { ingredients },
      { upsert: true, new: true } 
    );

    res.json(updatedPantry.ingredients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getPantry, updatePantry };

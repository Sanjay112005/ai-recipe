// 📁 controllers/recipeController.js

const Recipe = require('../models/Recipe');

// 🔄 Create and Save a Recipe
const saveRecipe = async (req, res) => {
  const { title, ingredients, instructions, source, image } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const recipe = await Recipe.create({
      userId: req.user._id,
      title,
      ingredients,
      instructions,
      source: source || 'user-generated',
      image: image || ''  // default to empty string if not provided
    });

    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Error saving recipe', error: err.message });
  }
};

// 📥 Get All Recipes by User
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recipes', error: err.message });
  }
};

// ❌ Delete a Recipe by ID
const deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;

  try {
    const recipe = await Recipe.findOne({ _id: recipeId, userId: req.user._id });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting recipe', error: err.message });
  }
};

// ✏️ Update a Recipe by ID
const updateRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const { title, ingredients, instructions, image, source } = req.body;

  try {
    const recipe = await Recipe.findOne({ _id: recipeId, userId: req.user._id });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (title) recipe.title = title;
    if (ingredients) recipe.ingredients = ingredients;
    if (instructions) recipe.instructions = instructions;
    if (image) recipe.image = image;
    if (source) recipe.source = source;

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Error updating recipe', error: err.message });
  }
};

module.exports = {
  saveRecipe,
  getRecipes,
  deleteRecipe,
  updateRecipe
};

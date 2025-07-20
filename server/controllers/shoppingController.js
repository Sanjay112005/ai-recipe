const ShoppingItem = require("../models/ShoppingItem");
const Recipe = require("../models/Recipe");

const getShoppingList = async (req, res) => {
  try {
    const list = await ShoppingItem.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch list", error: err.message });
  }
};

const addItem = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Item name is required" });

  try {
    const item = await ShoppingItem.create({ userId: req.user._id, name });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item", error: err.message });
  }
};

const toggleItem = async (req, res) => {
  try {
    const item = await ShoppingItem.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.bought = !item.bought;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Toggle failed", error: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await ShoppingItem.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

const addRecipeToList = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findOne({ _id: recipeId, userId: req.user._id });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const newItems = recipe.ingredients.map(ing => ({ name: ing, userId: req.user._id }));
    const inserted = await ShoppingItem.insertMany(newItems);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ message: "Failed to add from recipe", error: err.message });
  }
};

module.exports = {
  getShoppingList,
  addItem,
  toggleItem,
  deleteItem,
  addRecipeToList,
};

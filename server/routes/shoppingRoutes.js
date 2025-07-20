const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const {
  getShoppingList,
  addItem,
  toggleItem,
  deleteItem,
  addRecipeToList
} = require("../controllers/shoppingController");

router.use(protect);

router.get("/", getShoppingList);
router.post("/", addItem);
router.patch("/:id/toggle", toggleItem);
router.delete("/:id", deleteItem);
router.post("/from-recipe/:recipeId", addRecipeToList);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  saveRecipe,
  getRecipes,
  deleteRecipe,
  updateRecipe
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecipes);
router.post('/', protect, saveRecipe);


router.delete('/:id', protect, deleteRecipe);
router.put('/:id', protect, updateRecipe);

module.exports = router;

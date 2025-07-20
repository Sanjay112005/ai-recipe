// routes/pantryRoutes.js
const express = require('express');
const router = express.Router();
const { getPantry, updatePantry } = require('../controllers/pantryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPantry);
router.post('/', protect, updatePantry);

module.exports = router;

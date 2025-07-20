// 📁 server/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { generateRecipeFromAI } = require('../controllers/aiController');
const {protect} = require('../middleware/authMiddleware');

// POST /api/ai/generate
router.post('/generate', protect, generateRecipeFromAI);

module.exports = router;

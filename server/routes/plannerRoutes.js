const express = require('express');
const router = express.Router();
const { getPlanner, addOrUpdatePlan, deletePlan } = require('../controllers/plannerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPlanner);
router.post('/', protect, addOrUpdatePlan);
router.delete('/:id', protect, deletePlan);

module.exports = router;

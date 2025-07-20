const Planner = require('../models/Planner');

const getPlanner = async (req, res) => {
  try {
    const plans = await Planner.find({ userId: req.user._id }).populate('recipe');
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching planner', error: err.message });
  }
};

const addOrUpdatePlan = async (req, res) => {
  const { date, recipeId } = req.body;

  if (!date || !recipeId) {
    return res.status(400).json({ message: 'Missing date or recipeId' });
  }

  try {
    const existing = await Planner.findOne({ userId: req.user._id, date });

    if (existing) {
      existing.recipe = recipeId;
      await existing.save();
      return res.json(existing);
    }

    const newPlan = await Planner.create({
      userId: req.user._id,
      date,
      recipe: recipeId
    });

    res.status(201).json(newPlan);
  } catch (err) {
    res.status(500).json({ message: 'Error saving plan', error: err.message });
  }
};

const deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await Planner.findOne({ _id: id, userId: req.user._id });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    await plan.deleteOne();
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting plan', error: err.message });
  }
};

module.exports = { getPlanner, addOrUpdatePlan, deletePlan };

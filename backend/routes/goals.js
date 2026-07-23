const express = require('express');
const Goal = require('../models/Goal');
const router = express.Router();

// Get goals for a user
router.get('/:userId', async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.params.userId });
    res.json(goals);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add a new goal
router.post('/', async (req, res) => {
  try {
    const newGoal = new Goal(req.body);
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Add or withdraw money from a goal
router.put('/:id/add', async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    goal.currentAmount += Number(req.body.amount);
    
    // Prevent the amount from dropping below 0
    if (goal.currentAmount < 0) goal.currentAmount = 0; 
    
    await goal.save();
    res.json(goal);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// Delete a goal
router.delete('/:id', async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});
module.exports = router;
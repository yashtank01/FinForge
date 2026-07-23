const express = require('express');
const Habit = require('../models/Habit');
const router = express.Router();

// Get habits for a user
router.get('/:userId', async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.params.userId });
    res.json(habits);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Add a new habit
router.post('/', async (req, res) => {
  try {
    const newHabit = new Habit(req.body);
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Mark habit as completed for the day
router.put('/:id/complete', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    // Check if it was already completed today
    const today = new Date().toDateString();
    const lastComplete = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
    
    if (today === lastComplete) {
      return res.status(400).json({ message: 'Habit already completed today!' });
    }

    habit.streak += 1;
    habit.completedToday = true;
    habit.lastCompleted = new Date();
    await habit.save();
    res.json(habit);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// Delete a habit
router.delete('/:id', async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
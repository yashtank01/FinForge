const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

// User submits feedback
router.post('/', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Admin deletes feedback
router.delete('/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Habit = require('../models/Habit');
const Goal = require('../models/Goal');
const Feedback = require('../models/Feedback'); 
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@finforge.com' && password === 'admin123') {
    res.json({ token: 'admin_secure_token_999' });
  } else {
    res.status(401).json({ message: 'Invalid Admin Credentials' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const totalHabits = await Habit.countDocuments();
    const totalGoals = await Goal.countDocuments();
    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
    const feedbacks = await Feedback.find().sort({ date: -1 }); // Fetch Feedbacks
    
    res.json({ totalUsers, totalTransactions, totalHabits, totalGoals, recentUsers, feedbacks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    await Transaction.deleteMany({ userId });
    await Habit.deleteMany({ userId });
    await Goal.deleteMany({ userId });
    await Feedback.deleteMany({ userId });
    res.json({ message: 'User and all associated data completely deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  frequency: { type: String, enum: ['Daily', 'Weekly', 'Monthly'], default: 'Daily' },
  streak: { type: Number, default: 0 },
  completedToday: { type: Boolean, default: false },
  lastCompleted: { type: Date }
});

module.exports = mongoose.model('Habit', habitSchema);
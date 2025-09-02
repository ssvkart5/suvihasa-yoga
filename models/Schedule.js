// models/Schedule.js
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  location: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);

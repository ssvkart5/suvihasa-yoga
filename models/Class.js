// models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  style: String,
  schedule: {
    date: Date,
    duration: Number, // in minutes
    location: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);

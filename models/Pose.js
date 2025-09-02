// models/Pose.js
const mongoose = require('mongoose');

const poseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  style: String, // e.g., Hatha, Vinyasa, Ashtanga
  imageUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Pose', poseSchema);

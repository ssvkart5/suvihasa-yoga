// models/Instructor.js
const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: String,
  specialties: [String], // e.g., ['Hatha', 'Vinyasa']
  experienceYears: Number,
  profileImage: String,
}, { timestamps: true });

module.exports = mongoose.model('Instructor', instructorSchema);

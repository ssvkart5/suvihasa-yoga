// models/Instructor.js
const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  imageUrl: String
});

module.exports = mongoose.model('Instructor', instructorSchema);

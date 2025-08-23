const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  image: String,
});

module.exports = mongoose.model('Instructor', instructorSchema);

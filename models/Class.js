const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: String,
  style: String,
  duration: Number,
  instructor: String,
  videoUrl: String,
});

module.exports = mongoose.model('Class', classSchema);

const mongoose = require('mongoose');
const learningSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
  media: [String], // URLs to videos or PDFs
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Learning', learningSchema);

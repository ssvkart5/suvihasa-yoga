// models/Style.js
const mongoose = require('mongoose');

const styleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Style', styleSchema);

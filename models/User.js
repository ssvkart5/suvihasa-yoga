const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // hashed
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student'
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    profileImage: String,
    bio: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

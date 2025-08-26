const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    title: String,
    style: String,
    duration: Number,
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor'
    },
    videoUrl: String,
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    schedule: [
      {
        date: Date,
        location: String,
        isVirtual: Boolean,
      }
    ],
    capacity: Number,
    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);

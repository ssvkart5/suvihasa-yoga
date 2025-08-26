const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema(
  {
    name: String,
    bio: String,
    image: String,
    email: { type: String, unique: true },
    phone: String,
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String
    },
    specialties: [String],
    certifications: [String],
    yearsOfExperience: Number,
    classesTaught: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
      }
    ],
    availability: [
      {
        day: String, // e.g., 'Monday'
        startTime: String,
        endTime: String,
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Instructor', instructorSchema);

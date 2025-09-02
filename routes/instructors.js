// routes/instructors.js
const express = require('express');
const router = express.Router();
const Instructor = require('../models/Instructor');
const auth = require('../middleware/auth');

// Create instructor profile (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can add instructors' });
    }

    const { userId, bio, specialties, experienceYears, profileImage } = req.body;
    const instructor = new Instructor({ userId, bio, specialties, experienceYears, profileImage });
    await instructor.save();
    res.status(201).json(instructor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create instructor', details: err.message });
  }
});

// Get all instructors
router.get('/', async (req, res) => {
  try {
    const instructors = await Instructor.find().populate('userId', 'name email');
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch instructors', details: err.message });
  }
});

// Get instructor by ID
router.get('/:id', async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate('userId', 'name email');
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching instructor', details: err.message });
  }
});

// Update instructor profile (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update instructors' });
    }

    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });

    Object.assign(instructor, req.body);
    await instructor.save();
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update instructor', details: err.message });
  }
});

// Delete instructor profile (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete instructors' });
    }

    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    res.json({ message: 'Instructor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete instructor', details: err.message });
  }
});

module.exports = router;

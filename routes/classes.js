const express = require('express');
const router = express.Router();
const YogaClass = require('../models/Class');
const auth = require('../middleware/auth');

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await YogaClass.find().populate('instructor');
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get single class
router.get('/:id', async (req, res) => {
  try {
    const yogaClass = await YogaClass.findById(req.params.id).populate('instructor');
    if (!yogaClass) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(yogaClass);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

// Create new class (protected)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      instructor,
      schedule,
      duration,
      capacity,
      style,
      difficulty,
      videoUrl
    } = req.body;

    if (!title || !instructor || !schedule) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newClass = await YogaClass.create({
      title,
      instructor,
      schedule,
      duration: duration || 60,
      capacity: capacity || 20,
      style,
      difficulty,
      videoUrl
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// Update class
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedClass = await YogaClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Delete class
router.delete('/:id', auth, async (req, res) => {
  try {
    await YogaClass.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

module.exports = router;

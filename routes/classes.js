const express = require('express');
const router = express.Router();
const YogaClass = require('../models/Class');

// Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await YogaClass.getAll();
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get single class
router.get('/:id', async (req, res) => {
  try {
    const yogaClass = await YogaClass.getById(req.params.id);
    if (!yogaClass) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(yogaClass);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

// Create new class
router.post('/', async (req, res) => {
  try {
    const { name, instructor, schedule, duration, capacity, description } = req.body;
    
    if (!name || !instructor || !schedule) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newClass = await YogaClass.create({
      name,
      instructor,
      schedule,
      duration: duration || 60,
      capacity: capacity || 20,
      description: description || ''
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// Update class
router.put('/:id', async (req, res) => {
  try {
    const updatedClass = await YogaClass.update(req.params.id, req.body);
    res.json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Delete class
router.delete('/:id', async (req, res) => {
  try {
    await YogaClass.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});
// Middleware for authentication (example)
const auth = require('../middleware/auth');

router.post('/create', auth, (req, res) => {
  // Only authenticated users can create classes
});


module.exports = router;

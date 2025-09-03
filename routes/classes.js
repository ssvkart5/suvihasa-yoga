const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const auth = require('../middleware/auth');

// 📌 Create a class (Instructor/Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, instructorId, style, schedule } = req.body;

    if (!['instructor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const yogaClass = new Class({ title, description, instructorId, style, schedule });
    await yogaClass.save();
    res.status(201).json(yogaClass);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create class', details: err.message });
  }
});

// 📌 Get all classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find().populate('instructorId', 'name');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes', details: err.message });
  }
});

// 📌 Get a single class by ID
router.get('/:id', async (req, res) => {
  try {
    const yogaClass = await Class.findById(req.params.id).populate('instructorId', 'name');
    if (!yogaClass) return res.status(404).json({ error: 'Class not found' });
    res.json(yogaClass);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching class', details: err.message });
  }
});

// 📌 Update a class (Instructor/Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const yogaClass = await Class.findById(req.params.id);
    if (!yogaClass) return res.status(404).json({ error: 'Class not found' });

    if (req.user.role !== 'admin' && req.user.id !== yogaClass.instructorId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    Object.assign(yogaClass, req.body);
    await yogaClass.save();
    res.json({ message: 'Class updated successfully', yogaClass });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update class', details: err.message });
  }
});

// 🗑️ Delete a class (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete classes' });
    }

    const yogaClass = await Class.findByIdAndDelete(req.params.id);
    if (!yogaClass) return res.status(404).json({ error: 'Class not found' });

    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete class', details: err.message });
  }
});

// ✅ Export the router
module.exports = router;

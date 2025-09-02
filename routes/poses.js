// routes/poses.js
const express = require('express');
const router = express.Router();
const Pose = require('../models/Pose');
const auth = require('../middleware/auth');

// Create a pose (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can add poses' });
    }

    const { name, description, difficulty, style, imageUrl } = req.body;
    const pose = new Pose({ name, description, difficulty, style, imageUrl });
    await pose.save();
    res.status(201).json(pose);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create pose', details: err.message });
  }
});

// Get all poses
router.get('/', async (req, res) => {
  try {
    const poses = await Pose.find();
    res.json(poses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch poses', details: err.message });
  }
});

// Get a pose by ID
router.get('/:id', async (req, res) => {
  try {
    const pose = await Pose.findById(req.params.id);
    if (!pose) return res.status(404).json({ error: 'Pose not found' });
    res.json(pose);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching pose', details: err.message });
  }
});

// Update a pose (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update poses' });
    }

    const pose = await Pose.findById(req.params.id);
    if (!pose) return res.status(404).json({ error: 'Pose not found' });

    Object.assign(pose, req.body);
    await pose.save();
    res.json(pose);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pose', details: err.message });
  }
});

// Delete a pose (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete poses' });
    }

    const pose = await Pose.findByIdAndDelete(req.params.id);
    if (!pose) return res.status(404).json({ error: 'Pose not found' });
    res.json({ message: 'Pose deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete pose', details: err.message });
  }
});

module.exports = router;

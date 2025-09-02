// routes/styles.js
const express = require('express');
const router = express.Router();
const Style = require('../models/Style');
const auth = require('../middleware/auth');

// Create a style (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can add styles' });
    }

    const { name, description } = req.body;
    const existing = await Style.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Style already exists' });

    const style = new Style({ name, description });
    await style.save();
    res.status(201).json(style);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create style', details: err.message });
  }
});

// Get all styles
router.get('/', async (req, res) => {
  try {
    const styles = await Style.find();
    res.json(styles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch styles', details: err.message });
  }
});

// Get a style by ID
router.get('/:id', async (req, res) => {
  try {
    const style = await Style.findById(req.params.id);
    if (!style) return res.status(404).json({ error: 'Style not found' });
    res.json(style);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching style', details: err.message });
  }
});

// Update a style (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update styles' });
    }

    const style = await Style.findById(req.params.id);
    if (!style) return res.status(404).json({ error: 'Style not found' });

    Object.assign(style, req.body);
    await style.save();
    res.json(style);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update style', details: err.message });
  }
});

// Delete a style (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete styles' });
    }

    const style = await Style.findByIdAndDelete(req.params.id);
    if (!style) return res.status(404).json({ error: 'Style not found' });
    res.json({ message: 'Style deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete style', details: err.message });
  }
});

module.exports = router;

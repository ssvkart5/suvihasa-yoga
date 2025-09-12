const express = require('express');
const router = express.Router();
const Learning = require('../models/Learning');
const verifyToken = require('../middleware/auth'); // ✅ direct import

// GET all learning modules
router.get('/', async (req, res) => {
  try {
    const learnings = await Learning.find().populate('instructor');
    res.json(learnings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch learnings' });
  }
});

// GET a single learning module
router.get('/:id', async (req, res) => {
  try {
    const learning = await Learning.findById(req.params.id).populate('instructor');
    if (!learning) return res.status(404).json({ error: 'Learning not found' });
    res.json(learning);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch learning' });
  }
});

// POST a new learning module (instructors only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const learning = new Learning(req.body);
    await learning.save();
    res.status(201).json(learning);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create learning' });
  }
});

module.exports = router;

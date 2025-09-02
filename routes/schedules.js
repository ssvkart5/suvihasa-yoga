// routes/schedules.js
const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const auth = require('../middleware/auth');

// Create a schedule (Instructor/Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { classId, date, duration, location } = req.body;

    if (!['instructor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const schedule = new Schedule({ classId, date, duration, location });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create schedule', details: err.message });
  }
});

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('classId', 'title');
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schedules', details: err.message });
  }
});

// Get schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('classId', 'title');
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching schedule', details: err.message });
  }
});

// Update schedule (Instructor/Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update schedules' });
    }

    Object.assign(schedule, req.body);
    await schedule.save();
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update schedule', details: err.message });
  }
});

// Delete schedule (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete schedules' });
    }

    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete schedule', details: err.message });
  }
});

module.exports = router;

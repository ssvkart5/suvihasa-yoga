const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const auth = require('../middleware/auth'); // Optional: protect routes
const { getAllClasses } = require('../controllers/classController');


// Get all classes
router.get('/classes', classController.getAllClasses);

// Get a single class by ID
router.get('/classes/:id', classController.getClassById);

// Create a new class (protected)
router.post('/classes', auth, classController.createClass);

// Update a class (protected)
router.put('/classes/:id', auth, classController.updateClass);

// Delete a class (protected)
router.delete('/classes/:id', auth, classController.deleteClass);

module.exports = router;

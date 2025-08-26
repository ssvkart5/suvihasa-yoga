const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

const Instructor = require('../models/Instructor');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  validateInstructor,
  validateLogin,
  validatePasswordReset
} = require('../middleware/validation');

// Multer config for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/instructors/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'instructor-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    cb(mimetype && extname ? null : new Error('Only image files are allowed'));
  }
});

// Register
router.post('/register', validateInstructor, async (req, res) => {
  try {
    const existing = await Instructor.findOne({
      $or: [{ email: req.body.email }, { employeeId: req.body.employeeId }]
    });
    if (existing) return res.status(400).json({ success: false, message: 'Instructor already exists' });

    const instructor = new Instructor(req.body);
    await instructor.save();

    const token = instructor.generateAuthToken();
    const response = instructor.toObject();
    delete response.password;

    res.status(201).json({ success: true, message: 'Registered successfully', data: { instructor: response, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
  }
});

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const instructor = await Instructor.findByCredentials(req.body.email, req.body.password);
    if (!instructor.isActive) return res.status(401).json({ success: false, message: 'Account deactivated' });

    instructor.lastLogin = new Date();
    await instructor.save();

    const token = instructor.generateAuthToken();
    const response = instructor.toObject();
    delete response.password;

    res.json({ success: true, message: 'Login successful', data: { instructor: response, token } });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Logout
router.post('/logout', auth, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.user.id)
      .select('-password')
      .populate('courses', 'title code credits');

    if (!instructor) return res.status(404).json({ success: false, message: 'Instructor not found' });

    res.json({ success: true, data: instructor });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    ['password', 'email', 'employeeId', 'isActive', 'isVerified'].forEach(field => delete updates[field]);

    const instructor = await Instructor.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!instructor) return res.status(404).json({ success: false, message: 'Instructor not found' });

    res.json({ success: true, message: 'Profile updated', data: instructor });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating profile', error: err.message });
  }
});

// Avatar upload
router.post('/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const instructor = await Instructor.findByIdAndUpdate(req.user.id, {
      profilePicture: req.file.path
    }, { new: true }).select('-password');

    res.json({ success: true, message: 'Avatar uploaded', data: { profilePicture: instructor.profilePicture } });
  } catch {
    res.status(500).json({ success: false, message: 'Error uploading avatar' });
  }
});

// Admin: Get all instructors
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, department, designation, isActive, sortBy } = req.query;
    const skip = (page - 1) * limit;
    const filter = {};
    if (department) filter.department = department;
    if (designation) filter.designation = designation;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const sort = sortBy ? { [sortBy.split(':')[0]]: sortBy.split(':')[1] === 'desc' ? -1 : 1 } : { createdAt: -1 };

    const instructors = await Instructor.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('courses', 'title code');

    const total = await Instructor.countDocuments(filter);

    res.json({
      success: true,
      data: {
        instructors,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      }
    });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching instructors' });
  }
});

// Admin: Get, update, delete instructor by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id)
      .select('-password')
      .populate('courses', 'title code credits description');

    if (!instructor) return res.status(404).json({ success: false, message: 'Instructor not found' });

    res.json({ success: true, data: instructor });
  } catch {
    res.status(500).json({ success: false, message: 'Error fetching instructor' });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 12);

    const instructor = await Instructor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!instructor) return res.status(404).json({ success: false, message: 'Instructor not found' });

    res.json({ success: true, message: 'Instructor updated', data: instructor });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating instructor', error: err.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) return res.status(404).json({ success: false, message: 'Instructor not found' });

    res.json({ success: true, message: 'Instructor deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Error deleting instructor' });
  }
});

// Password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const instructor = await Instructor.findOne({ email: req.body.email });
    if (!instructor) return res.status(404).json({ success: false, message: 'Email not found' });

    const resetToken = instructor.createPasswordResetToken();
    await instructor.save({ validateBeforeSave: false });

    res.json({ success: true, message: 'Reset token generated', resetToken }); // Remove in production
  } catch {
    res.status(500).json({ success: false, message: 'Error generating reset token' });
  }
});

router.post('/reset-password/:token', validatePasswordReset, async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const instructor = await Instructor.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!instructor) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

        instructor.password = req.body.password;
        instructor.passwordResetToken = undefined;
        instructor.passwordResetExpires = undefined;
    
        await instructor.save();
        res.json({ success: true, message: 'Password reset successful' });
      } catch (err) {
        res.status(500).json({ success: false, message: 'Error resetting password', error: err.message });
      }
    });

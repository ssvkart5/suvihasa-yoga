// routes/instructors.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

// Import models and middleware
const Instructor = require('../models/Instructor');
const auth = require('../middleware/auth'); // Authentication middleware
const adminAuth = require('../middleware/adminAuth'); // Admin authentication middleware
const { validateInstructor, validateLogin, validatePasswordReset } = require('../middleware/validation');

// Configure multer for file uploads (profile pictures)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/instructors/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'instructor-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @route   POST /api/instructors/register
// @desc    Register a new instructor
// @access  Public (or Admin only - uncomment adminAuth middleware)
router.post('/register', validateInstructor, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      employeeId,
      department,
      designation,
      specialization,
      experience,
      qualification,
      bio,
      dateOfBirth,
      address
    } = req.body;

    // Check if instructor already exists
    const existingInstructor = await Instructor.findOne({
      $or: [{ email }, { employeeId }]
    });

    if (existingInstructor) {
      return res.status(400).json({
        success: false,
        message: 'Instructor with this email or employee ID already exists'
      });
    }

    // Create new instructor
    const instructor = new Instructor({
      firstName,
      lastName,
      email,
      phone,
      password,
      employeeId,
      department,
      designation,
      specialization,
      experience,
      qualification,
      bio,
      dateOfBirth,
      address
    });

    await instructor.save();

    // Generate auth token
    const token = instructor.generateAuthToken();

    // Remove password from response
    const instructorResponse = instructor.toObject();
    delete instructorResponse.password;

    res.status(201).json({
      success: true,
      message: 'Instructor registered successfully',
      data: {
        instructor: instructorResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// @route   POST /api/instructors/login
// @desc    Login instructor
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find instructor by credentials
    const instructor = await Instructor.findByCredentials(email, password);

    if (!instructor.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }

    // Update last login
    instructor.lastLogin = new Date();
    await instructor.save();

    // Generate auth token
    const token = instructor.generateAuthToken();

    // Remove password from response
    const instructorResponse = instructor.toObject();
    delete instructorResponse.password;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        instructor: instructorResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid login credentials'
    });
  }
});

// @route   POST /api/instructors/logout
// @desc    Logout instructor (if using token blacklisting)
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // If implementing token blacklisting, add token to blacklist here
    // await TokenBlacklist.create({ token: req.token });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// @route   GET /api/instructors/profile
// @desc    Get current instructor's profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.user.id)
      .populate('courses', 'title code credits')
      .select('-password');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    res.json({
      success: true,
      data: instructor
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// @route   PUT /api/instructors/profile
// @desc    Update current instructor's profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    
    // Remove fields that shouldn't be updated through this route
    delete updates.password;
    delete updates.email;
    delete updates.employeeId;
    delete updates.isActive;
    delete updates.isVerified;

    const instructor = await Instructor.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: instructor
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message
    });
  }
});

// @route   POST /api/instructors/upload-avatar
// @desc    Upload profile picture
// @access  Private
router.post('/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const instructor = await Instructor.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.path },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: instructor.profilePicture
      }
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading avatar'
    });
  }
});

// @route   GET /api/instructors
// @desc    Get all instructors (with pagination and filtering)
// @access  Private (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.designation) filter.designation = req.query.designation;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    // Build sort object
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

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
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Instructors fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching instructors'
    });
  }
});

// @route   GET /api/instructors/:id
// @desc    Get instructor by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id)
      .select('-password')
      .populate('courses', 'title code credits description');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    res.json({
      success: true,
      data: instructor
    });

  } catch (error) {
    console.error('Instructor fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching instructor'
    });
  }
});

// @route   PUT /api/instructors/:id
// @desc    Update instructor by ID
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updates = req.body;

    // Hash password if it's being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    res.json({
      success: true,
      message: 'Instructor updated successfully',
      data: instructor
    });

  } catch (error) {
    console.error('Instructor update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating instructor',
      error: error.message
    });
  }
});

// @route   DELETE /api/instructors/:id
// @desc    Delete instructor
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    res.json({
      success: true,
      message: 'Instructor deleted successfully'
    });

  } catch (error) {
    console.error('Instructor delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting instructor'
    });
  }
});

// @route   POST /api/instructors/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const instructor = await Instructor.findOne({ email });
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'No instructor found with this email address'
      });
    }

    // Generate reset token
    const resetToken = instructor.createPasswordResetToken();
    await instructor.save({ validateBeforeSave: false });

    // In a real application, send email here
    // const resetURL = `${req.protocol}://${req.get('host')}/api/instructors/reset-password/${resetToken}`;
    // await sendPasswordResetEmail(instructor.email, resetURL);

    res.json({
      success: true,
      message: 'Password reset token sent to email',
      // For development only - remove in production
      resetToken: resetToken
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing forgot password request'
    });
  }
});

// @route   POST /api/instructors/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', validatePasswordReset, async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find instructor with valid reset token
    const instructor = await Instructor.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!instructor) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired'
      });
    }

    // Set new password
    instructor.password = password;
    instructor.passwordResetToken = undefined;
    instructor.passwordResetExpires = undefined;

    await instructor.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password'
    });
  }
});

// @route   POST /api/instructors/change-password
// @desc    Change password (when logged in)
// @access  Private
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const instructor = await Instructor.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await instructor.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Set new password
    instructor.password = newPassword;
    await instructor.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
});

// @route   GET /api/instructors/department/:department
// @desc    Get instructors by department
// @access  Private
router.get('/department/:department', auth, async (req, res) => {
  try {
    const instructors = await Instructor.findByDepartment(req.params.department)
      .select('-password')
      .populate('courses', 'title code');

    res.json({
      success: true,
      data: instructors
    });

  } catch (error) {
    console.error('Department instructors fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching instructors by department'
    });
  }
});

// @route   POST /api/instructors/:id/deactivate
// @desc    Deactivate instructor account
// @access  Private (Admin)
router.post('/:id/deactivate', adminAuth, async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    res.json({
      success: true,
      message: 'Instructor account deactivated successfully',
      data: instructor
    });

  } catch (error) {
    console.error('Deactivate instructor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deactivating instructor'
    });
  }
});

// @route   POST /api/instructors/:id/activate
// @desc    Activate instructor account
// @access  Private (Admin)
router.post('/:id/activate', adminAuth, async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: 'Instructor not found'
      });
    }

    res.json({
      success: true,
      message: 'Instructor account activated successfully',
      data: instructor
    });

  } catch (error) {
    console.error('Activate instructor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error activating instructor'
    });
  }
});

module.exports = router;
const express = require('express'); 
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/auth'); // Adjust path if needed

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// 📝 Register a new user (POST)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔑 Login (POST)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: { username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🧪 Browser-friendly GET routes (for quick testing/debugging)
router.get('/register', (req, res) => {
  res.send('This is the REGISTER endpoint. Please use POST with JSON body.');
});

router.get('/login', (req, res) => {
  res.send('This is the LOGIN endpoint. Please use POST with JSON body.');
});

module.exports = router;

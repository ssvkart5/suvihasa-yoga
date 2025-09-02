require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import your routes
const authRoutes = require('./routes/auth');
const instructorRoutes = require('./routes/instructors');
const classRoutes = require('./routes/classes');
const poseRoutes = require('./routes/poses');
const mediaRoutes = require('./routes/media');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/poses', poseRoutes);
app.use('/api/media', mediaRoutes);

// Health check
app.get('/health', (req, res) => res.send('🧘‍♀️ Suvihasa Yoga backend is healthy'));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// MongoDB connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

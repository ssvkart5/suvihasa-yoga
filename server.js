require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const { APP_NAME, PORT } = require('./config/constants');
const env = require('./config/env');

// Log environment info
console.log(`🌱 Environment: ${env.nodeEnv}`);
console.log(`🔗 Connecting to DB: ${env.mongoUri}`);
console.log(`🚀 Starting ${APP_NAME} on port ${PORT}`);

// Initialize DB connection
connectDB()
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/suvihasa-yoga/auth', require('./routes/auth'));
app.use('/suvihasa-yoga/instructors', require('./routes/instructors'));
app.use('/suvihasa-yoga/classes', require('./routes/classes'));
app.use('/suvihasa-yoga/poses', require('./routes/poses'));
app.use('/suvihasa-yoga/media', require('./routes/media'));
app.use('/suvihasa-yoga/learnings', require('./routes/learnings'));
app.use('/suvihasa-yoga/bookings', require('./routes/bookings'));

// Health check
app.get('/', (req, res) => res.send('🧘‍♂️ Welcome to Suvihasa Yoga API'));
app.get('/health', (req, res) => res.send('🧘‍♀️ Suvihasa Yoga backend is healthy'));

// Start server
app.listen(PORT || 3000, () => {
  console.log(`🚀 Server running on port ${PORT || 3000}`);
});

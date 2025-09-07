// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB (Cosmos DB with Mongo API)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to Cosmos DB (Mongo API)'))
.catch(err => console.error('❌ DB connection error:', err));

// Routes
const userRoutes = require('./routes/users');
const classRoutes = require('./routes/classes');
const scheduleRoutes = require('./routes/schedules');
const poseRoutes = require('./routes/poses');
const styleRoutes = require('./routes/styles');
const instructorRoutes = require('./routes/instructors');
const mediaRoutes = require('./routes/media');

app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/poses', poseRoutes);
app.use('/api/styles', styleRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/classes', require('./routes/classes'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/poses', require('./routes/poses'));
app.use('/api/styles', require('./routes/styles'));
app.use('/api/instructors', require('./routes/instructors'));
app.use('/api/media', require('./routes/media'));




// Root
app.get('/', (req, res) => {
  res.send('🧘‍♀️ Yoga Web API is running on Azure!');
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

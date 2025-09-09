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

app.use('/suvihasa-yoga/users', userRoutes);
app.use('/suvihasa-yoga/classes', classRoutes);
app.use('/suvihasa-yoga/schedules', scheduleRoutes);
app.use('/suvihasa-yoga/poses', poseRoutes);
app.use('/suvihasa-yoga/styles', styleRoutes);
app.use('/suvihasa-yoga/instructors', instructorRoutes);
app.use('/suvihasa-yoga/media', mediaRoutes);
app.use('/suvihasa-yoga/classes', require('./routes/classes'));
app.use('/suvihasa-yoga/schedules', require('./routes/schedules'));
app.use('/suvihasa-yoga/poses', require('./routes/poses'));
app.use('/suvihasa-yoga/styles', require('./routes/styles'));
app.use('/suvihasa-yoga/instructors', require('./routes/instructors'));
app.use('/suvihasa-yoga/media', require('./routes/media'));




// Root
app.get('/', (req, res) => {
  res.send('🧘‍♀️ Yoga Web API is running on Azure!');
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

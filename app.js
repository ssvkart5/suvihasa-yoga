// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging (optional but helpful)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MongoDB (Cosmos DB with Mongo API)
mongoose.connect(process.env.MONGO_URI || process.env.AZURE_COSMOS_CONNECTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsInsecure: false,
  retryWrites: false,
  serverSelectionTimeoutMS: 5000
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

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Root
app.get('/', (req, res) => {
  res.send('🧘‍♀️ Yoga Web API is running on Azure!');
});

// Start Server
const PORT = process.env.PORT || process.env.WEBSITES_PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

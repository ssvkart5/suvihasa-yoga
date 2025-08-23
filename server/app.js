const express = require('express');
const path = require('path');
const classRoutes = require('../routes/classes');
const instructorRoutes = require('../routes/instructors');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/classes', classRoutes);
app.use('/api/auth', require('../routes/auth'));
app.use('/api/instructors', instructorRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
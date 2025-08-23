const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Class = mongoose.model('Class', new mongoose.Schema({
  title: String,
  date: String,
  instructor: String
}));

const Instructor = mongoose.model('Instructor', new mongoose.Schema({
  name: String,
  bio: String,
  image: String
}));

const Testimonial = mongoose.model('Testimonial', new mongoose.Schema({
  name: String,
  message: String
}));

app.get('/', async (req, res) => {
  const classes = await Class.find();
  const instructors = await Instructor.find();
  const testimonials = await Testimonial.find();
  res.render('index', { classes, instructors, testimonials });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running...');
});

const Instructor = require('../models/Instructor');

exports.getAll = async (req, res) => {
  const instructors = await Instructor.find();
  res.json(instructors);
};

exports.create = async (req, res) => {
  const instructor = new Instructor(req.body);
  await instructor.save();
  res.json(instructor);
};


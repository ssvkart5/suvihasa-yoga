const Class = require('../models/Class');

const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('instructor');
    res.json(classes);
  } catch (err) {
    res.status(500).send('Error fetching classes');
  }
};

const getClassById = async (req, res) => {
  // Your logic here
};

const createClass = async (req, res) => {
  // Your logic here
};

const updateClass = async (req, res) => {
  // Your logic here
};

const deleteClass = async (req, res) => {
  // Your logic here
};

module.exports = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
};

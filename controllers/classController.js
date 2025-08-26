const Class = require('../models/Class');

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('instructor');
    res.json(classes);
  } catch (err) {
    res.status(500).send('Error fetching classes');
  }
};

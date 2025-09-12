const Class = require('../models/Class');

exports.getAll = async (req, res) => {
  const classes = await Class.find();
  res.json(classes);
};

exports.create = async (req, res) => {
  const yogaClass = new Class(req.body);
  await yogaClass.save();
  res.json(yogaClass);
};

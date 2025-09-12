const Pose = require('../models/Pose');

exports.getAll = async (req, res) => {
  const poses = await Pose.find();
  res.json(poses);
};

exports.create = async (req, res) => {
  const pose = new Pose(req.body);
  await pose.save();
  res.json(pose);
};

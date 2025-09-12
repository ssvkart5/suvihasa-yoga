const Schedule = require('../models/Schedule');

exports.getAll = async (req, res) => {
  const schedules = await Schedule.find();
  res.json(schedules);
};

exports.create = async (req, res) => {
  const schedule = new Schedule(req.body);
  await schedule.save();
  res.json(schedule);
};

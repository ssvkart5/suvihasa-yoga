const Style = require('../models/Style');

exports.getAll = async (req, res) => {
  const styles = await Style.find();
  res.json(styles);
};

exports.create = async (req, res) => {
  const style = new Style(req.body);
  await style.save();
  res.json(style);
};

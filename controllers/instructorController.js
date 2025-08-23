// controllers/instructorController.js

exports.createInstructor = (req, res) => {
  const { name, bio, image } = req.body;
  // You can later add validation and DB logic here
  res.status(201).json({
    message: 'Instructor created successfully',
    data: { name, bio, image }
  });
};
exports.validateInstructor = (req, res, next) => {
  console.log('Validation middleware triggered');
  next();
};

exports.validateLogin = (req, res, next) => {
  // Example login validation
  next();
};

exports.validatePasswordReset = (req, res, next) => {
  if (!req.body.password || req.body.password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }
  next();
};

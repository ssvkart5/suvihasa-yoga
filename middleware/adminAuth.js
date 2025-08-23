// middleware/adminAuth.js
module.exports = (req, res, next) => {
  console.log('Admin auth middleware triggered');
  next();
};

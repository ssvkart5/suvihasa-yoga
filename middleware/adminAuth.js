// middleware/adminAuth.js
module.exports = (req, res, next) => {
  console.log('Admin auth middleware triggered');
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admins only.' });
  }
};

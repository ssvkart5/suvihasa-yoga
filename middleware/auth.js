// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  try {
    // Expect header like: Authorization: Bearer <token>
    const bearer = token.split(" ");
    const jwtToken = bearer.length === 2 ? bearer[1] : bearer[0];

    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      req.userId = decoded.id;
      next();
    });
  } catch (err) {
    return res.status(400).json({ error: "Invalid token format" });
  }
};

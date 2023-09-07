const jwt = require("jsonwebtoken");

function auth(role) {
  return function (req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access denied. No token provided.");
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (!role.includes(decoded.role)) {
        return res.status(403).send("Forbidden.");
      }
      req.body.userID = decoded.userID;
      req.body.role = decoded.role;
      next();
    } catch {
      res.status(503).json({ message: "Session expired" });
    }
  };
}

module.exports = auth;

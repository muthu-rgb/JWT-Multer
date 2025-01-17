const { jwtDecode } = require("jwt-decode");

const checkRole = (req, res, next) => {
  const token = req.headers["authorization"];
  const decoded = jwtDecode(token);
  if (decoded.role === "admin" || decoded.role === "user") {
    next();
  } else if (decoded.role !== "admin" || decoded.role !== "user") {
    return res.status(403).json({ error: "Forbidden - Role is not valid" });
  }
};

module.exports = checkRole;

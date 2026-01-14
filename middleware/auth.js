//auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/usermodels/User");

const protect = async (req, res, next) => {
  const header =
    req.headers.authorization || req.headers.Authorization;

  const token =
    header && header.startsWith("Bearer")
      ? header.split(" ")[1]
      : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized — token missing" });
  }

  try {
    const secret =
      process.env.JWT_ACCESS_SECRET ||
      process.env.JWT_SECRET ||
      "secret";

    const decoded = jwt.verify(token, secret);

    // 🔍 Fetch user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found" });
    }

    // 🚫 BLOCK DISABLED USERS
    if (!req.user.isActive) {
      return res.status(403).json({
        message: "Account disabled by admin",
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token invalid or expired",
      error: err.message,
    });
  }
};

// ROLE CHECK (ADMIN / SELLER / USER)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isTokenBlacklisted } = require("../utils/tokenManager");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    if (isTokenBlacklisted(token)) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    if (!decoded.id || !decoded.role) {
      throw new Error("Invalid token payload");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    const message =
      err.name === "TokenExpiredError"
        ? "Session expired"
        : err.name === "JsonWebTokenError"
        ? "Invalid token"
        : "Authentication failed";

    res.status(401).json({ success: false, message });
  }
};

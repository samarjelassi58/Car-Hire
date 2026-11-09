const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isTokenBlacklisted } = require("../utils/tokenManager");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing or invalid",
    });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ success: false, message: "Token manquant" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) return res.status(401).json({ success: false, message: "Invalid token" });
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Session expired" : "Invalid token";
    return res.status(401).json({ success: false, message });
  }

  try {
    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ success: false, message: "Session revoked; please sign in again" });
    }
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User no longer exists" });
    req.user = user;
    req.token = token;
    req.tokenPayload = decoded;
    return next();
  } catch (error) {
    return next(error);
  }
};

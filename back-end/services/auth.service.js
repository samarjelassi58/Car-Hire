const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const toPublicUser = (user) => {
  const result = user.toObject();
  delete result.Password;
  return result;
};

const authenticate = async (Email, Password) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const normalizedEmail = typeof Email === "string" ? Email.trim().toLowerCase() : "";
  const user = await User.findOne({ Email: normalizedEmail }).select("+Password");

  if (!user || typeof Password !== "string" || !(await bcrypt.compare(Password, user.Password))) {
    return null;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user: toPublicUser(user) };
};

module.exports = { authenticate };

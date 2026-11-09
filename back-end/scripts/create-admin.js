require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

const createAdmin = async () => {
  const { MONGO_URI, ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_PHONE, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGO_URI) throw new Error("MONGO_URI must be configured");
  if (!ADMIN_FIRST_NAME || !ADMIN_LAST_NAME || !ADMIN_PHONE || !ADMIN_EMAIL) {
    throw new Error("ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_PHONE and ADMIN_EMAIL are required");
  }
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
    throw new Error("ADMIN_PASSWORD must contain at least 8 characters");
  }

  await mongoose.connect(MONGO_URI);
  const email = ADMIN_EMAIL.trim().toLowerCase();
  if (await User.exists({ Email: email })) {
    throw new Error("A user with ADMIN_EMAIL already exists; no account was changed");
  }
  await User.create({
    FirstName: ADMIN_FIRST_NAME.trim(),
    LastName: ADMIN_LAST_NAME.trim(),
    Phone: ADMIN_PHONE.trim(),
    Email: email,
    Password: await bcrypt.hash(ADMIN_PASSWORD, 12),
    role: "admin",
  });
  console.log(`Administrator created: ${email}`);
};

createAdmin()
  .catch((error) => {
    console.error("Could not create administrator:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
  });

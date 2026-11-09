const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    FirstName: { type: String, required: true, trim: true },
    LastName: { type: String, required: true, trim: true },
    Phone: { type: String, required: true, trim: true },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    Password: { type: String, required: true, minlength: 8, select: false },

    role: {
      type: String,
      required: true,
      enum: ["client", "admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

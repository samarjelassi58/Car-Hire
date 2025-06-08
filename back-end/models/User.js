const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Phone: { type: Number, required: true },
    Email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    Password: { type: String, required: true, minlength: 6 },

    role: {
      type: String,
      required: true,
      enum: ["client", "admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

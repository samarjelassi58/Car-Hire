const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  messageObject: { type: String },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["new", "read", "closed"],
    default: "new",
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);

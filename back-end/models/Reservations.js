const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
    required: true,
  },
}, { timestamps: true });

reservationSchema.index({ carId: 1, startDate: 1, endDate: 1 });
reservationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Reservation", reservationSchema);

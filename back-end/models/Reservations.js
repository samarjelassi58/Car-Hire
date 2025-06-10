const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  voitureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
});

module.exports = mongoose.model("Reservation", reservationSchema);

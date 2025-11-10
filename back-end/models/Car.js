const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerDay: { type: Number, required: true }, 
  fuelType: { type: String },
  category: { type: String },
  tag: { type: String },
  options: [{ type: String }],
  image: { type: String },
  reservedPeriods: [
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);

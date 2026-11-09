const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  pricePerDay: { type: Number, required: true, min: 0 },
  fuelType: { type: String, trim: true },
  transmission: { type: String, trim: true },
  category: { type: String, trim: true },
  tag: { type: String, trim: true },
  options: [{ type: String, trim: true }],
  image: { type: String, trim: true },
  reservedPeriods: [
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Car", carSchema);

require("dotenv").config();
const mongoose = require("mongoose");
const Car = require("../models/Car");
const cars = require("./data/cars.json");

const seedCars = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be configured");
  await mongoose.connect(process.env.MONGO_URI);

  let created = 0;
  for (const item of cars) {
    if (await Car.exists({ name: item.name })) continue;
    await Car.create({
      name: item.name,
      pricePerDay: parseInt(item.price, 10),
      options: item.features || [],
      tag: item.tag,
      category: item.category,
      fuelType: item.fuelType,
    });
    created += 1;
  }
  console.log(`Seed done: ${created} car(s) created, ${cars.length - created} already present`);
};

seedCars()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());

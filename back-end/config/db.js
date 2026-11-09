const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be configured");
  await mongoose.connect(process.env.MONGO_URI, {
    autoIndex: process.env.MONGO_AUTO_INDEX === "true",
    bufferCommands: process.env.MONGO_BUFFER_COMMANDS !== "false",
    serverSelectionTimeoutMS: 10000,
  });
  console.log("MongoDB connected");
};

module.exports = connectDB;

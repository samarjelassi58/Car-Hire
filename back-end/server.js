require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");
const carRoutes = require("./routes/car.routes");
const reservationRoutes = require("./routes/reservation.routes");
const ApiError = require("./utils/ApiError");
const { validateImageStorage } = require("./services/imageStorage");

const createApp = () => {
  const app = express();
  const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.disable("x-powered-by");
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new ApiError(403, "Origine non autorisée par la politique CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  app.use(express.json({ limit: "1mb" }));
  app.use((req, res, next) => {
    if (req.body === undefined) req.body = {};
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ success: false, message: "Le corps de la requête doit être un objet JSON" });
    }
    next();
  });
  app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
    dotfiles: "deny",
    fallthrough: false,
    maxAge: "1d",
  }));

  app.get("/api/health", (req, res) => {
    const databaseConnected = mongoose.connection.readyState === 1;
    res.status(databaseConnected ? 200 : 503).json({
      status: databaseConnected ? "OK" : "DEGRADED",
      database: databaseConnected ? "connected" : "disconnected",
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/message", messageRoutes);
  app.use("/api/car", carRoutes);
  app.use("/api/reservation", reservationRoutes);

  app.use((req, res, next) => next(new ApiError(404, "Route introuvable")));

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
      return res.status(400).json({ success: false, message: "JSON invalide" });
    }
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Une valeur unique existe déjà" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Identifiant ou valeur invalide" });
    }
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message });
    }
    console.error("Unhandled API error:", error);
    return res.status(500).json({ success: false, message: "Erreur interne du serveur" });
  });
  return app;
};

const app = createApp();

const startServer = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be configured");
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }
  validateImageStorage();
  await connectDB();
  const port = Number(process.env.PORT) || 5000;
  const server = app.listen(port, () => {
    console.log(`Car Hire API listening on port ${port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received; shutting down`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };
  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
  return server;
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, createApp, startServer };

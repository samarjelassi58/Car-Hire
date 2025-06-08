const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Configuration des options MongoDB
    const options = {
      autoIndex: process.env.MONGO_AUTO_INDEX === "true",
      bufferCommands: process.env.MONGO_BUFFER_COMMANDS !== "false",
    };

    // Connexion à MongoDB avec gestion automatique
    await mongoose.connect(process.env.MONGO_URI, options);

    console.log("✅ MongoDB connecté avec succès");

    // Gestion automatique des erreurs de connexion
    mongoose.connection.on("error", (err) => {
      console.error("❌ Erreur de connexion MongoDB:", err.message);
    });

    // Gestion de la déconnexion
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  Déconnecté de MongoDB");
    });

    // Fermeture propre lors de l'arrêt de l'application
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("⏹  Connexion MongoDB fermée (SIGINT)");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Échec de connexion à MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

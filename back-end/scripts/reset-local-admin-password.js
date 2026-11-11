require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

const resetAdminPassword = async ({ uri, email, password }, dependencies = { mongoose, User, bcrypt }) => {
  if (!uri || !/^mongodb:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?\/[^/?]+(?:\?.*)?$/i.test(uri)) {
    throw new Error("La connexion doit cibler une base MongoDB locale explicite.");
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    throw new Error("ADMIN_EMAIL doit être renseigné.");
  }
  if (typeof password !== "string" || password.length < 8) {
    throw new Error("ADMIN_PASSWORD doit contenir au moins 8 caractères.");
  }
  await dependencies.mongoose.connect(uri, { autoIndex: false, serverSelectionTimeoutMS: 10000 });
  const filter = { Email: email.trim().toLowerCase(), role: "admin" };
  if (!(await dependencies.User.exists(filter))) {
    throw new Error("Aucun compte administrateur ne correspond à ADMIN_EMAIL.");
  }
  const hash = await dependencies.bcrypt.hash(password, 12);
  const result = await dependencies.User.updateOne(filter, { $set: { Password: hash } });
  if (result.matchedCount !== 1) {
    throw new Error("Le compte administrateur n'a pas pu être mis à jour.");
  }
};

if (require.main === module) {
  resetAdminPassword({
    uri: process.env.MONGO_URI,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  })
    .then(() => console.log("Mot de passe administrateur local mis à jour."))
    .catch((error) => {
      if (error instanceof mongoose.Error || error.name.startsWith("Mongo")) {
        console.error(`Erreur MongoDB (${error.name}) : vérifiez la connexion locale et les droits.`);
      } else {
        console.error("Échec :", error.message);
      }
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}

module.exports = { resetAdminPassword };

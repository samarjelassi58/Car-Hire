require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Car = require("../models/Car");

const sourceDir = path.join(__dirname, "..", "utils", "uploads");
const targetDir = path.join(__dirname, "..", "uploads", "cars");

// Convertit les documents importés avec des champs français (nom, prix_par_jour, ...)
// vers le schéma de l'API. Le script est idempotent.
const normalizeCars = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be configured");
  await mongoose.connect(process.env.MONGO_URI);
  fs.mkdirSync(targetDir, { recursive: true });

  const legacy = await Car.collection.find({ nom: { $exists: true } }).toArray();
  let migrated = 0;
  const missingImages = [];

  for (const doc of legacy) {
    const price = parseFloat(String(doc.prix_par_jour ?? "").replace(",", "."));
    const set = {
      name: String(doc.nom).trim(),
      pricePerDay: Number.isFinite(price) ? price : 0,
      fuelType: doc.carburant,
      transmission: doc.transmission,
      category: doc.categorie,
    };

    if (doc.image) {
      const file = path.basename(String(doc.image));
      const source = path.join(sourceDir, file);
      if (fs.existsSync(source)) {
        fs.copyFileSync(source, path.join(targetDir, file));
        set.image = `/uploads/cars/${file}`;
      } else {
        missingImages.push(file);
      }
    }

    await Car.collection.updateOne(
      { _id: doc._id },
      {
        $set: Object.fromEntries(Object.entries(set).filter(([, value]) => value !== undefined)),
        $unset: { nom: "", prix_par_jour: "", carburant: "", categorie: "" },
      }
    );
    migrated += 1;
  }

  console.log(`Normalisation terminée : ${migrated} voiture(s) migrée(s)`);
  if (missingImages.length) console.log(`Images introuvables dans utils/uploads : ${missingImages.join(", ")}`);
};

normalizeCars()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());

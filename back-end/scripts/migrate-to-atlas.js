require("dotenv").config();
const fs = require("node:fs/promises");
const path = require("node:path");
const readline = require("node:readline/promises");
const mongoose = require("mongoose");
const { isDeepStrictEqual } = require("node:util");
const { v2: cloudinary } = require("cloudinary");
const { inspectSource, localMongoUri } = require("./check-migration-source");

const COLLECTIONS = ["users", "cars", "reservations", "messages", "revokedtokens"];
const IMAGE_DIRECTORY = path.resolve(__dirname, "..", "uploads", "cars");
const CLOUDINARY_FOLDER = "car-hire-migration";
const CLOUDINARY_MARKER = "car-hire-local-migration-v1";

const withoutImage = (document) => {
  const { image, ...rest } = document;
  return rest;
};

const assertSourceIsSafe = (report) => {
  const unsafe = [
    "missingImages",
    "unsupportedImages",
    "orphanedReservations",
    "invalidDates",
    "reservationsWithoutPeriod",
    "periodsWithoutReservation",
  ].filter((field) => report[field] > 0);
  if (unsafe.length) throw new Error(`Le contrôle de la source a détecté des problèmes : ${unsafe.join(", ")}.`);
};

const readDocuments = async (db, names) => {
  const result = new Map();
  for (const name of names) result.set(name, await db.collection(name).find({}).toArray());
  return result;
};

const validateTargetCollections = async (targetDb, sourceDocuments) => {
  const sourceIds = new Map(
    [...sourceDocuments].map(([name, documents]) => [name, new Set(documents.map((doc) => String(doc._id)))])
  );
  const names = await targetDb.listCollections({}, { nameOnly: true }).toArray();
  const existing = new Map();

  for (const { name } of names) {
    if (!COLLECTIONS.includes(name)) {
      const count = await targetDb.collection(name).countDocuments();
      if (count) throw new Error("La base Atlas contient déjà des documents hors migration ; aucune donnée n’a été modifiée.");
      continue;
    }
    const docs = await targetDb.collection(name).find({}).toArray();
    const allowedIds = sourceIds.get(name);
    if (docs.some((doc) => !allowedIds.has(String(doc._id)))) {
      throw new Error(`La collection Atlas "${name}" contient des documents qui ne viennent pas de cette source.`);
    }
    for (const targetDoc of docs) {
      const sourceDoc = sourceDocuments.get(name).find((doc) => String(doc._id) === String(targetDoc._id));
      const equal = name === "cars"
        ? isDeepStrictEqual(withoutImage(sourceDoc), withoutImage(targetDoc))
        : isDeepStrictEqual(sourceDoc, targetDoc);
      if (!equal) {
        throw new Error(`Un document Atlas de "${name}" diffère de la source ; il ne sera pas écrasé.`);
      }
    }
    existing.set(name, docs);
  }
  return existing;
};

const loadMigrationPlan = async ({ sourceDb, targetDb, imageDirectory = IMAGE_DIRECTORY }) => {
  const report = await inspectSource(sourceDb, imageDirectory);
  assertSourceIsSafe(report);
  const sourceDocuments = await readDocuments(sourceDb, COLLECTIONS);
  const targetDocuments = await validateTargetCollections(targetDb, sourceDocuments);
  return { report, sourceDocuments, targetDocuments };
};

const validateSecureUrl = (result) => {
  if (!result || typeof result.secure_url !== "string" || !result.secure_url.startsWith("https://")) {
    throw new Error("Cloudinary n’a pas renvoyé d’URL HTTPS valide.");
  }
  return result.secure_url;
};

const ensureImageUploaded = async ({ car, imageDirectory, uploader, api }) => {
  const filename = car.image.slice("/uploads/cars/".length);
  const publicId = `${CLOUDINARY_FOLDER}/${car._id}`;
  const file = path.join(imageDirectory, filename);
  let resource;
  try {
    resource = await uploader.upload(file, {
      public_id: publicId,
      overwrite: false,
      unique_filename: false,
      resource_type: "image",
      context: { carHireMigration: CLOUDINARY_MARKER },
    });
  } catch (uploadError) {
    try {
      resource = await api.resource(publicId, { resource_type: "image" });
    } catch (lookupError) {
      throw new AggregateError(
        [uploadError, lookupError],
        "L’image n’a pas pu être transférée ni retrouvée dans Cloudinary."
      );
    }
    if (resource.context?.custom?.carHireMigration !== CLOUDINARY_MARKER) {
      throw new Error("Un asset Cloudinary utilise déjà l’identifiant réservé à cette migration ; aucun asset n’a été écrasé.");
    }
  }
  return validateSecureUrl(resource);
};

const migrate = async ({
  sourceDb,
  targetDb,
  imageDirectory = IMAGE_DIRECTORY,
  uploadImage = (car) => ensureImageUploaded({ car, imageDirectory, uploader: cloudinary.uploader, api: cloudinary.api }),
  execute = false,
}) => {
  const plan = await loadMigrationPlan({ sourceDb, targetDb, imageDirectory });
  const counts = Object.fromEntries([...plan.sourceDocuments].map(([name, documents]) => [name, documents.length]));
  if (!execute) return { dryRun: true, counts, existingDocuments: [...plan.targetDocuments.values()].reduce((sum, docs) => sum + docs.length, 0) };

  const carImages = new Map();
  for (const car of plan.sourceDocuments.get("cars")) {
    carImages.set(String(car._id), await uploadImage(car));
  }
  const expected = new Map();
  for (const [name, docs] of plan.sourceDocuments) {
    expected.set(name, name === "cars"
      ? docs.map((doc) => ({ ...doc, image: carImages.get(String(doc._id)) }))
      : docs);
  }

  for (const [name, docs] of expected) {
    const operations = docs.map((doc) => ({
      updateOne: { filter: { _id: doc._id }, update: { $setOnInsert: doc }, upsert: true },
    }));
    if (operations.length) await targetDb.collection(name).bulkWrite(operations, { ordered: true });
  }

  for (const [name, docs] of expected) {
    const actual = await targetDb.collection(name).find({}).toArray();
    if (actual.length !== docs.length) throw new Error(`Vérification après migration échouée pour "${name}" (nombre de documents différent).`);
    const actualById = new Map(actual.map((doc) => [String(doc._id), doc]));
    if (docs.some((doc) => !isDeepStrictEqual(doc, actualById.get(String(doc._id))))) {
      throw new Error(`Vérification après migration échouée pour "${name}" (contenu différent).`);
    }
  }
  return { dryRun: false, counts };
};

const main = async () => {
  const execute = process.argv.includes("--execute");
  if (process.argv.some((arg) => arg !== "--execute" && arg !== process.argv[0] && arg !== process.argv[1])) {
    throw new Error("Usage : node scripts/migrate-to-atlas.js [--execute]");
  }
  if (!localMongoUri.test(process.env.MONGO_URI || "")) {
    throw new Error("MONGO_URI doit désigner la base MongoDB locale.");
  }
  if (!/^mongodb\+srv:\/\//i.test(process.env.ATLAS_MONGO_URI || "")) {
    throw new Error("ATLAS_MONGO_URI doit désigner votre cluster MongoDB Atlas.");
  }
  if (!process.env.ATLAS_MONGO_URI.includes("/car-hire")) {
    throw new Error("ATLAS_MONGO_URI doit cibler la base car-hire.");
  }
  if (execute && (!process.env.CLOUDINARY_URL || !cloudinary.config().cloud_name || !cloudinary.config().api_key)) {
    throw new Error("CLOUDINARY_URL doit être configuré avant de transférer les images.");
  }

  const sourceConnection = await mongoose.createConnection(process.env.MONGO_URI, {
    autoIndex: false,
    serverSelectionTimeoutMS: 10000,
  }).asPromise();
  let targetConnection;
  try {
    targetConnection = await mongoose.createConnection(process.env.ATLAS_MONGO_URI, {
      autoIndex: false,
      serverSelectionTimeoutMS: 10000,
    }).asPromise();
    const result = await migrate({
      sourceDb: sourceConnection.db,
      targetDb: targetConnection.db,
      execute,
    });
    console.log(execute ? "Migration terminée et vérifiée." : "Simulation terminée : aucune donnée ni image n’a été envoyée.");
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await Promise.all([
      sourceConnection.close(),
      targetConnection ? targetConnection.close() : Promise.resolve(),
    ]);
  }
};

if (require.main === module) {
  (async () => {
    if (process.argv.includes("--execute")) {
      const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
      try {
        const answer = await terminal.question(
          "Cette opération enverra voitures, images, comptes, réservations et messages vers Atlas/Cloudinary. Tapez COPIER MES DONNEES pour confirmer : "
        );
        if (answer !== "COPIER MES DONNEES") {
          console.log("Annulé : aucune donnée n’a été transférée.");
          return;
        }
      } finally {
        terminal.close();
      }
    }
    await main();
  })().catch((error) => {
    if (error instanceof mongoose.Error || error.name?.startsWith("Mongo")) {
      console.error(`Migration arrêtée (${error.name}${error.code ? `, code ${error.code}` : ""}). Vérifiez les connexions et les droits.`);
    } else {
      console.error("Migration arrêtée :", error.message);
    }
    process.exitCode = 1;
  });
}

module.exports = {
  COLLECTIONS,
  CLOUDINARY_FOLDER,
  CLOUDINARY_MARKER,
  ensureImageUploaded,
  loadMigrationPlan,
  migrate,
  validateTargetCollections,
};

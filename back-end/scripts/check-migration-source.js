require("dotenv").config();
const fs = require("node:fs/promises");
const path = require("node:path");
const mongoose = require("mongoose");

const imageDirectory = path.resolve(__dirname, "..", "uploads", "cars");
const localMongoUri = /^mongodb:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?\/[^/?]+(?:\?.*)?$/i;

const inspectSource = async (db, directory = imageDirectory) => {
  const [cars, users, reservations, messages] = await Promise.all([
    db.collection("cars").find({}, { projection: { _id: 1, image: 1, reservedPeriods: 1 } }).toArray(),
    db.collection("users").find({}, { projection: { _id: 1 } }).toArray(),
    db.collection("reservations").find({}, { projection: { carId: 1, userId: 1, status: 1, startDate: 1, endDate: 1 } }).toArray(),
    db.collection("messages").countDocuments(),
  ]);
  const carIds = new Set(cars.map((car) => String(car._id)));
  const userIds = new Set(users.map((user) => String(user._id)));
  let missingImages = 0;
  let unsupportedImages = 0;
  const root = await fs.realpath(directory);
  for (const car of cars) {
    if (typeof car.image !== "string" || !car.image.startsWith("/uploads/cars/")) {
      unsupportedImages++;
      continue;
    }
    const name = car.image.slice("/uploads/cars/".length);
    if (!name || name === "." || name === ".." || name.includes("/") || name.includes("\\") || path.basename(name) !== name) {
      unsupportedImages++;
      continue;
    }
    try {
      const file = await fs.realpath(path.join(root, name));
      const stat = await fs.stat(file);
      if (path.dirname(file) !== root || !stat.isFile()) unsupportedImages++;
    } catch (error) {
      if (error.code === "ENOENT") missingImages++;
      else throw error;
    }
  }
  const orphanedReservations = reservations.filter(
    (reservation) => !carIds.has(String(reservation.carId)) || !userIds.has(String(reservation.userId))
  ).length;
  const periodCounts = new Map();
  const reservationCounts = new Map();
  let invalidDates = 0;
  const addPeriod = (counts, carId, start, end) => {
    if (!(start instanceof Date) || !(end instanceof Date) ||
        !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || start > end) {
      invalidDates++;
      return;
    }
    const key = `${String(carId)}|${start.toISOString()}|${end.toISOString()}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  };
  for (const car of cars) {
    if (car.reservedPeriods !== undefined && !Array.isArray(car.reservedPeriods)) {
      throw new Error("Une voiture contient une liste de périodes invalide.");
    }
    for (const period of car.reservedPeriods || []) {
      if (!period || typeof period !== "object") {
        invalidDates++;
        continue;
      }
      addPeriod(periodCounts, car._id, period.startDate, period.endDate);
    }
  }
  for (const reservation of reservations) {
    if (["pending", "confirmed"].includes(reservation.status)) {
      addPeriod(reservationCounts, reservation.carId, reservation.startDate, reservation.endDate);
    } else if (reservation.status !== "cancelled") {
      throw new Error("Une réservation contient un statut invalide.");
    }
  }
  const unmatched = (source, target) => [...source].reduce(
    (total, [key, count]) => total + Math.max(0, count - (target.get(key) || 0)), 0
  );
  return {
    cars: cars.length,
    users: users.length,
    reservations: reservations.length,
    messages,
    missingImages,
    unsupportedImages,
    orphanedReservations,
    invalidDates,
    reservationsWithoutPeriod: unmatched(reservationCounts, periodCounts),
    periodsWithoutReservation: unmatched(periodCounts, reservationCounts),
  };
};

if (require.main === module) {
  (async () => {
    if (!localMongoUri.test(process.env.MONGO_URI || "")) {
      throw new Error("La source doit être une base MongoDB locale explicite.");
    }
    await mongoose.connect(process.env.MONGO_URI, { autoIndex: false, serverSelectionTimeoutMS: 10000 });
    const report = await inspectSource(mongoose.connection.db);
    console.log(JSON.stringify(report, null, 2));
    if (report.missingImages || report.unsupportedImages || report.orphanedReservations ||
        report.invalidDates || report.reservationsWithoutPeriod || report.periodsWithoutReservation) {
      console.error("Contrôle incomplet : résoudre les anomalies avant la migration.");
      process.exitCode = 1;
    }
  })()
    .catch((error) => {
      if (error instanceof mongoose.Error || error.name.startsWith("Mongo")) {
        console.error(`Erreur MongoDB (${error.name}) : vérifiez la connexion locale et les droits.`);
      } else {
        console.error("Échec du contrôle :", error.message);
      }
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}

module.exports = { inspectSource, localMongoUri };

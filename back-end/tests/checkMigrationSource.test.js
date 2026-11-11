const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { inspectSource, localMongoUri } = require("../scripts/check-migration-source");

const database = (cars, users, reservations, messages = 0) => ({
  collection(name) {
    const docs = { cars, users, reservations }[name];
    return {
      find: () => ({ toArray: async () => docs }),
      countDocuments: async () => messages,
    };
  },
});

test("vérifie les images et les références sans modifier les données", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "migration-check-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await fs.writeFile(path.join(directory, "car.png"), "image");
  const cars = [
    { _id: "car1", image: "/uploads/cars/car.png" },
    { _id: "car2", image: "/uploads/cars/missing.png" },
    { _id: "car3", image: "/uploads/cars/../secret" },
  ];
  const reservations = [
    { carId: "car1", userId: "user1", status: "cancelled" },
    { carId: "missing", userId: "user1", status: "cancelled" },
  ];
  assert.deepEqual(await inspectSource(database(cars, [{ _id: "user1" }], reservations, 3), directory), {
    cars: 3, users: 1, reservations: 2, messages: 3,
    missingImages: 1, unsupportedImages: 1, orphanedReservations: 1,
    invalidDates: 0, reservationsWithoutPeriod: 0, periodsWithoutReservation: 0,
  });
});

test("détecte les périodes et réservations actives incohérentes, y compris les doublons", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "migration-periods-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await fs.writeFile(path.join(directory, "car.png"), "image");
  const start = new Date("2026-12-01T00:00:00Z");
  const end = new Date("2026-12-02T00:00:00Z");
  const cars = [{ _id: "car1", image: "/uploads/cars/car.png", reservedPeriods: [
    { startDate: start, endDate: end }, { startDate: start, endDate: end },
    { startDate: end, endDate: start },
  ] }];
  const bookings = [
    { carId: "car1", userId: "user1", status: "confirmed", startDate: start, endDate: end },
    { carId: "car1", userId: "user1", status: "pending", startDate: end, endDate: end },
    { carId: "car1", userId: "user1", status: "cancelled", startDate: end, endDate: end },
  ];
  const report = await inspectSource(database(cars, [{ _id: "user1" }], bookings), directory);
  assert.equal(report.invalidDates, 1);
  assert.equal(report.reservationsWithoutPeriod, 1);
  assert.equal(report.periodsWithoutReservation, 1);
});

test("refuse les connexions distantes et les chemins sans base", () => {
  assert.equal(localMongoUri.test("mongodb://localhost:27017/car-hire"), true);
  assert.equal(localMongoUri.test("mongodb://127.0.0.1:27017/car-hire"), true);
  assert.equal(localMongoUri.test("mongodb+srv://example.test/car-hire"), false);
  assert.equal(localMongoUri.test("mongodb://localhost:27017/"), false);
});

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { migrate } = require("../scripts/migrate-to-atlas");

const createDb = (initial = {}) => {
  const collections = new Map(
    Object.entries(initial).map(([name, documents]) => [name, documents.map((doc) => ({ ...doc }))])
  );
  return {
    collections,
    collection(name) {
      return {
        find: () => ({ toArray: async () => collections.get(name) || [] }),
        countDocuments: async () => (collections.get(name) || []).length,
        bulkWrite: async (operations) => {
          const documents = collections.get(name) || [];
          for (const { updateOne } of operations) {
            if (!documents.some((doc) => String(doc._id) === String(updateOne.filter._id))) {
              documents.push(updateOne.update.$setOnInsert);
            }
          }
          collections.set(name, documents);
        },
      };
    },
    listCollections: () => ({
      toArray: async () => [...collections.keys()].map((name) => ({ name })),
    }),
  };
};

const setup = async (t, targetInitial = {}) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "car-hire-atlas-migration-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  await fs.writeFile(path.join(directory, "car.png"), "fixture");
  const startDate = new Date("2027-01-10T00:00:00.000Z");
  const endDate = new Date("2027-01-12T00:00:00.000Z");
  const sourceDb = createDb({
    cars: [{ _id: "car-1", name: "Voiture test", image: "/uploads/cars/car.png", reservedPeriods: [{ startDate, endDate }] }],
    users: [{ _id: "user-1", Email: "test@example.test", Password: "bcrypt-hash", role: "client" }],
    reservations: [{ _id: "reservation-1", carId: "car-1", userId: "user-1", startDate, endDate, status: "confirmed" }],
    messages: [{ _id: "message-1", email: "test@example.test", message: "Message de test" }],
    revokedtokens: [{ _id: "token-1", tokenHash: "hash", expiresAt: endDate }],
  });
  return { directory, sourceDb, targetDb: createDb(targetInitial) };
};

test("la simulation vérifie et compte les données sans upload ni écriture Atlas", async (t) => {
  const { directory, sourceDb, targetDb } = await setup(t);
  let uploads = 0;
  const result = await migrate({
    sourceDb,
    targetDb,
    imageDirectory: directory,
    uploadImage: async () => { uploads++; return "https://example.test/car.png"; },
  });
  assert.equal(result.dryRun, true);
  assert.deepEqual(result.counts, { users: 1, cars: 1, reservations: 1, messages: 1, revokedtokens: 1 });
  assert.equal(uploads, 0);
  assert.equal(targetDb.collections.size, 0);
});

test("la migration conserve les identifiants, transfère les URLs et peut reprendre sans écraser", async (t) => {
  const { directory, sourceDb, targetDb } = await setup(t);
  let uploads = 0;
  const options = {
    sourceDb,
    targetDb,
    imageDirectory: directory,
    execute: true,
    uploadImage: async () => { uploads++; return "https://res.cloudinary.com/test/car.png"; },
  };
  assert.equal((await migrate(options)).dryRun, false);
  const migratedCar = targetDb.collections.get("cars")[0];
  assert.equal(migratedCar._id, "car-1");
  assert.equal(migratedCar.image, "https://res.cloudinary.com/test/car.png");
  assert.equal(targetDb.collections.get("users")[0].Password, "bcrypt-hash");
  assert.equal(targetDb.collections.get("reservations")[0].carId, "car-1");
  assert.equal(targetDb.collections.get("messages").length, 1);
  assert.equal(targetDb.collections.get("revokedtokens").length, 1);
  assert.equal((await migrate(options)).dryRun, false);
  assert.equal(targetDb.collections.get("cars").length, 1);
  assert.equal(uploads, 2);
});

test("refuse les documents Atlas non issus de la source avant tout upload", async (t) => {
  const { directory, sourceDb } = await setup(t, {
    users: [{ _id: "unrelated", Email: "other@example.test" }],
  });
  let uploads = 0;
  await assert.rejects(migrate({
    sourceDb,
    targetDb: createDb({ users: [{ _id: "unrelated", Email: "other@example.test" }] }),
    imageDirectory: directory,
    execute: true,
    uploadImage: async () => { uploads++; return "https://example.test/car.png"; },
  }), /ne viennent pas de cette source/);
  assert.equal(uploads, 0);
});

test("refuse de remplacer un document cible modifié", async (t) => {
  const { directory, sourceDb } = await setup(t, {
    users: [{ _id: "user-1", Email: "changed@example.test", Password: "bcrypt-hash", role: "client" }],
  });
  await assert.rejects(migrate({
    sourceDb,
    targetDb: createDb({
      users: [{ _id: "user-1", Email: "changed@example.test", Password: "bcrypt-hash", role: "client" }],
    }),
    imageDirectory: directory,
    execute: true,
  }), /diffère de la source/);
});

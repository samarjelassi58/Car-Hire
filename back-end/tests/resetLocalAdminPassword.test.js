const test = require("node:test");
const assert = require("node:assert/strict");
const { resetAdminPassword } = require("../scripts/reset-local-admin-password");

const config = { uri: "mongodb://127.0.0.1:27017/test", email: " ADMIN@example.test ", password: "new-password" };

const mocks = (exists = true, matchedCount = 1) => {
  const calls = [];
  return {
    calls,
    mongoose: { connect: async (...args) => calls.push(["connect", ...args]) },
    User: {
      exists: async (filter) => { calls.push(["exists", filter]); return exists; },
      updateOne: async (filter, update) => { calls.push(["update", filter, update]); return { matchedCount }; },
    },
    bcrypt: { hash: async (value, rounds) => { calls.push(["hash", value, rounds]); return "hashed"; } },
  };
};

test("met à jour uniquement l'administrateur ciblé avec un mot de passe haché", async () => {
  const deps = mocks();
  await resetAdminPassword(config, deps);
  assert.deepEqual(deps.calls.find(([name]) => name === "update"), [
    "update", { Email: "admin@example.test", role: "admin" }, { $set: { Password: "hashed" } },
  ]);
  assert.deepEqual(deps.calls.find(([name]) => name === "hash"), ["hash", "new-password", 12]);
  assert.equal(deps.calls[0][2].autoIndex, false);
});

test("refuse une base distante, des identifiants invalides et un administrateur absent", async () => {
  const deps = mocks(false);
  await assert.rejects(resetAdminPassword({ ...config, uri: "mongodb+srv://example.test/db" }, deps), /locale/);
  await assert.rejects(resetAdminPassword({ ...config, password: "short" }, deps), /8 caractères/);
  await assert.rejects(resetAdminPassword({ ...config, email: "" }, deps), /ADMIN_EMAIL/);
  assert.equal(deps.calls.length, 0);
  await assert.rejects(resetAdminPassword(config, deps), /Aucun compte/);
  assert.equal(deps.calls.some(([name]) => name === "update"), false);
  await assert.rejects(resetAdminPassword(config, mocks(true, 0)), /pas pu être mis à jour/);
});

const crypto = require("crypto");
const RevokedToken = require("../models/RevokedToken");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const addToBlacklist = async (token, expiresAt) => {
  await RevokedToken.updateOne(
    { tokenHash: hashToken(token) },
    { $set: { expiresAt: new Date(expiresAt) } },
    { upsert: true }
  );
};

const isTokenBlacklisted = async (token) =>
  Boolean(await RevokedToken.exists({ tokenHash: hashToken(token) }));

module.exports = { addToBlacklist, isTokenBlacklisted };

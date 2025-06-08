const blacklistedTokens = new Map();

const addToBlacklist = (token, expiresAt) => {
  blacklistedTokens.set(token, expiresAt);
};

const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

const cleanExpiredTokens = () => {
  const now = Date.now();
  for (const [token, expiresAt] of blacklistedTokens.entries()) {
    if (expiresAt <= now) {
      blacklistedTokens.delete(token);
    }
  }
};

setInterval(cleanExpiredTokens, 3600000);

module.exports = {
  blacklistedTokens,
  addToBlacklist,
  isTokenBlacklisted,
  cleanExpiredTokens,
};

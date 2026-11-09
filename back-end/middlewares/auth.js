const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isTokenBlacklisted } = require("../utils/tokenManager");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "En-tête d'autorisation absent ou invalide",
    });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ success: false, message: "Jeton manquant" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) return res.status(401).json({ success: false, message: "Jeton invalide" });
  } catch (err) {
    const message = err.name === "TokenExpiredError" ? "Session expirée" : "Jeton invalide";
    return res.status(401).json({ success: false, message });
  }

  try {
    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ success: false, message: "Session révoquée ; veuillez vous reconnecter" });
    }
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "Cet utilisateur n'existe plus" });
    req.user = user;
    req.token = token;
    req.tokenPayload = decoded;
    return next();
  } catch (error) {
    return next(error);
  }
};

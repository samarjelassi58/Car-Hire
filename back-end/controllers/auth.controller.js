const { authenticate } = require("../services/auth.service");
const { addToBlacklist } = require("../utils/tokenManager");

exports.login = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res.status(400).json({ success: false, message: "Email et mot de passe requis" });
  }

  const result = await authenticate(Email, Password);
  if (!result) {
    return res.status(401).json({ success: false, message: "Identifiants invalides" });
  }

  res.status(200).json({
    success: true,
    token: result.token,
    user: result.user,
  });
};

exports.logout = async (req, res) => {
  try {
    await addToBlacklist(req.token, req.tokenPayload.exp * 1000);
    res.status(200).json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ success: false, message: "Déconnexion impossible" });
  }
};

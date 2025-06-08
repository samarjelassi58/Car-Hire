const { authenticate } = require("../services/auth.service");
const { addToBlacklist } = require("../utils/tokenManager");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const { token, user } = await authenticate(Email, Password);

    res.status(200).json({
      success: true,
      token: `${token}`,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      success: false,
      message: "Aucun token fourni",
    });
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.decode(token);
  if (!decoded || !decoded.exp) {
    return res.status(400).json({
      success: false,
      message: "Token invalide",
    });
  }

  const expiresAt = decoded.exp * 1000;
  addToBlacklist(token, expiresAt);
  res.status(200).json({
    success: true,
    message: "Déconnexion réussie",
  });
};

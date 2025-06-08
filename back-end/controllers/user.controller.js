const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  try {
    const { FirstName, LastName, Phone, Email, Password, role } = req.body;
    if (!FirstName || !LastName || !Phone || !Email || !Password || !role) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà",
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      FirstName,
      LastName,
      Phone,
      Email,
      Password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user: {
        id: newUser._id,
        Email: newUser.Email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création :", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Reservation = require("../models/Reservations");
const ApiError = require("../utils/ApiError");

const emailPattern = /^\S+@\S+\.\S+$/;
const toPublicUser = (user) => {
  const result = user.toObject();
  delete result.Password;
  return result;
};

exports.createUser = async (req, res) => {
  const { FirstName, LastName, Phone, Email, Password } = req.body;
  if (![FirstName, LastName, Phone, Email, Password].every((value) =>
    typeof value === "string" && value.trim()
  )) {
    throw new ApiError(400, "Tous les champs sont requis");
  }
  const normalizedEmail = Email.trim().toLowerCase();
  if (!emailPattern.test(normalizedEmail)) throw new ApiError(400, "Adresse email invalide");
  if (Password.length < 8) throw new ApiError(400, "Le mot de passe doit contenir au moins 8 caractères");

  if (await User.exists({ Email: normalizedEmail })) {
    throw new ApiError(409, "Un utilisateur avec cet email existe déjà");
  }

  const user = await User.create({
    FirstName: FirstName.trim(),
    LastName: LastName.trim(),
    Phone: Phone.trim(),
    Email: normalizedEmail,
    Password: await bcrypt.hash(Password, 12),
    role: "client",
  });
  res.status(201).json({ success: true, user: toPublicUser(user) });
};

exports.listUsers = async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : { role: "client" };
  if (role && !["client", "admin"].includes(role)) {
    throw new ApiError(400, "Rôle invalide");
  }
  const users = await User.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: users });
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) throw new ApiError(404, "Utilisateur introuvable");
  res.json({ success: true, data: user });
};

exports.updateUser = async (req, res) => {
  const allowedFields = ["FirstName", "LastName", "Phone", "Email"];
  const update = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) update[field] = req.body[field];
  }
  if (!Object.keys(update).length) throw new ApiError(400, "Aucun champ modifiable fourni");
  for (const field of ["FirstName", "LastName", "Phone", "Email"]) {
    if (update[field] !== undefined && (typeof update[field] !== "string" || !update[field].trim())) {
      throw new ApiError(400, `${field} est invalide`);
    }
  }
  if (update.Email) {
    update.Email = update.Email.trim().toLowerCase();
    if (!emailPattern.test(update.Email)) throw new ApiError(400, "Adresse email invalide");
  }
  for (const field of ["FirstName", "LastName", "Phone"]) {
    if (update[field]) update[field] = update[field].trim();
  }

  const user = await User.findOneAndUpdate(
    { _id: req.params.id, role: "client" },
    { $set: update },
    { new: true, runValidators: true }
  );
  if (!user) throw new ApiError(404, "Client introuvable");
  res.json({ success: true, data: user });
};

exports.deleteUser = async (req, res) => {
  if (req.user.id === req.params.id) throw new ApiError(400, "Vous ne pouvez pas supprimer votre propre compte administrateur");
  const user = await User.findOne({ _id: req.params.id, role: "client" });
  if (!user) throw new ApiError(404, "Client introuvable");
  if (await Reservation.exists({ userId: user._id, status: { $ne: "cancelled" } })) {
    throw new ApiError(409, "Ce client possède des réservations actives");
  }
  await user.deleteOne();
  await Reservation.deleteMany({ userId: user._id, status: "cancelled" });
  res.json({ success: true, message: "Client supprimé", id: user._id });
};

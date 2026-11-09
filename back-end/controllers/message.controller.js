const mongoose = require("mongoose");
const Message = require("../models/Message");
const ApiError = require("../utils/ApiError");

const emailPattern = /^\S+@\S+\.\S+$/;

exports.addMessage = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, messageObject, message } = req.body;
  if (![firstName, lastName, email, message].every((value) =>
    typeof value === "string" && value.trim()
  )) {
    throw new ApiError(400, "Prénom, nom, email et message sont requis");
  }
  const normalizedEmail = email.trim().toLowerCase();
  if (!emailPattern.test(normalizedEmail)) throw new ApiError(400, "Adresse email invalide");

  const created = await Message.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    phoneNumber: typeof phoneNumber === "string" ? phoneNumber.trim() : "",
    messageObject: typeof messageObject === "string" ? messageObject.trim() : "",
    message: message.trim(),
  });
  res.status(201).json({ success: true, message: "Message envoyé", data: created });
};

exports.getMessages = async (req, res) => {
  const filter = {};
  if (req.query.status) {
    if (!["new", "read", "closed"].includes(req.query.status)) {
      throw new ApiError(400, "Statut de message invalide");
    }
    filter.status = req.query.status;
  }
  const messages = await Message.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: messages });
};

exports.updateMessageStatus = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, "Identifiant message invalide");
  const { status } = req.body;
  if (!["new", "read", "closed"].includes(status)) throw new ApiError(400, "Statut de message invalide");
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { $set: { status } },
    { new: true, runValidators: true }
  );
  if (!message) throw new ApiError(404, "Message introuvable");
  res.json({ success: true, data: message });
};

exports.deleteMessage = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, "Identifiant message invalide");
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) throw new ApiError(404, "Message introuvable");
  res.json({ success: true, message: "Message supprimé", id: message._id });
};

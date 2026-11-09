const mongoose = require("mongoose");
const Car = require("../models/Car");
const Reservation = require("../models/Reservations");
const ApiError = require("../utils/ApiError");
const { parseRentalDate } = require("../utils/dateUtils");

const validateId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Identifiant réservation invalide");
};

const parseDates = (body) => {
  const startDate = parseRentalDate(body.startDate);
  const endDate = parseRentalDate(body.endDate);
  if (!startDate || !endDate) {
    throw new ApiError(400, "Les dates doivent être au format YYYY-MM-DD");
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (startDate < today) throw new ApiError(400, "La date de début ne peut pas être dans le passé");
  if (endDate < startDate) throw new ApiError(400, "La date de fin doit être égale ou postérieure à la date de début");
  return { startDate, endDate };
};

exports.createReservation = async (req, res) => {
  const { carId } = req.body;
  if (!mongoose.isValidObjectId(carId)) throw new ApiError(400, "Identifiant voiture invalide");
  const { startDate, endDate } = parseDates(req.body);

  const existingCar = await Car.findById(carId).select("_id");
  if (!existingCar) throw new ApiError(404, "Voiture introuvable");

  const existingReservation = await Reservation.exists({
    carId,
    status: { $ne: "cancelled" },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  });
  if (existingReservation) throw new ApiError(409, "La voiture est déjà réservée pour cette période");

  const car = await Car.findOneAndUpdate(
    {
      _id: carId,
      reservedPeriods: {
        $not: { $elemMatch: { startDate: { $lte: endDate }, endDate: { $gte: startDate } } },
      },
    },
    { $push: { reservedPeriods: { startDate, endDate } } },
    { new: true }
  );
  if (!car) throw new ApiError(409, "La voiture est déjà réservée pour cette période");

  let reservation;
  try {
    reservation = await Reservation.create({
      carId,
      userId: req.user._id,
      startDate,
      endDate,
    });
  } catch (error) {
    await Car.updateOne({ _id: carId }, { $pull: { reservedPeriods: { startDate, endDate } } });
    throw error;
  }

  await populateRelations(reservation);
  res.status(201).json({ success: true, data: reservation });
};

exports.listMyReservations = async (req, res) => {
  const reservations = await Reservation.find({ userId: req.user._id })
    .populate("carId", "name pricePerDay image")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ success: true, data: reservations });
};

exports.listReservations = async (req, res) => {
  const filter = {};
  if (req.query.status) {
    if (!["pending", "confirmed", "cancelled"].includes(req.query.status)) {
      throw new ApiError(400, "Statut de réservation invalide");
    }
    filter.status = req.query.status;
  }
  const reservations = await Reservation.find(filter)
    .populate("carId", "name pricePerDay image")
    .populate("userId", "FirstName LastName Email Phone")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ success: true, data: reservations });
};

exports.getReservation = async (req, res) => {
  validateId(req.params.id);
  const filter = { _id: req.params.id };
  if (req.user.role !== "admin") filter.userId = req.user._id;
  const reservation = await Reservation.findOne(filter)
    .populate("carId", "name pricePerDay image")
    .populate("userId", "FirstName LastName Email Phone");
  if (!reservation) throw new ApiError(404, "Réservation introuvable");
  res.json({ success: true, data: reservation });
};

const populateRelations = (reservation) =>
  reservation.populate([
    { path: "carId", select: "name pricePerDay image" },
    { path: "userId", select: "FirstName LastName Email Phone" },
  ]);

const cancelReservation = async (reservationId, ownerId) => {
  const filter = { _id: reservationId, status: { $in: ["pending", "confirmed"] } };
  if (ownerId) filter.userId = ownerId;
  const reservation = await Reservation.findOneAndUpdate(
    filter,
    { $set: { status: "cancelled" } },
    { new: true }
  );
  if (!reservation) throw new ApiError(404, "Réservation introuvable ou déjà annulée");
  await Car.updateOne(
    { _id: reservation.carId },
    { $pull: { reservedPeriods: { startDate: reservation.startDate, endDate: reservation.endDate } } }
  );
  return populateRelations(reservation);
};

exports.cancelReservation = async (req, res) => {
  validateId(req.params.id);
  const ownerId = req.user.role === "admin" ? null : req.user._id;
  const reservation = await cancelReservation(req.params.id, ownerId);
  res.json({ success: true, data: reservation });
};

exports.updateReservationStatus = async (req, res) => {
  validateId(req.params.id);
  const { status } = req.body;
  if (status === "cancelled") {
    const reservation = await cancelReservation(req.params.id);
    return res.json({ success: true, data: reservation });
  }
  if (status !== "confirmed") throw new ApiError(400, "Le statut doit être confirmed ou cancelled");
  const reservation = await Reservation.findOneAndUpdate(
    { _id: req.params.id, status: "pending" },
    { $set: { status: "confirmed" } },
    { new: true, runValidators: true }
  );
  if (!reservation) throw new ApiError(404, "Réservation en attente introuvable");
  res.json({ success: true, data: await populateRelations(reservation) });
};

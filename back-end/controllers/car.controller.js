const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Car = require("../models/Car");
const Reservation = require("../models/Reservations");
const ApiError = require("../utils/ApiError");
const { uploadCarImage } = require("../services/imageStorage");

const editableFields = ["name", "pricePerDay", "fuelType", "transmission", "category", "tag", "options", "image"];
const fieldLabels = { fuelType: "Le carburant", transmission: "La transmission", category: "La catégorie", tag: "L'étiquette", image: "L'image" };
const uploadsDir = path.resolve(__dirname, "..", "uploads", "cars");

const validateId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Identifiant voiture invalide");
};

const normalizeOptions = (options) => {
  if (options === undefined) return undefined;
  const values = Array.isArray(options) ? options : [options];
  if (values.some((value) => typeof value !== "string")) {
    throw new ApiError(400, "Les options doivent être des chaînes de caractères");
  }
  return values.map((value) => value.trim()).filter(Boolean);
};

const removeLocalImage = async (image) => {
  if (typeof image !== "string" || !image.startsWith("/uploads/cars/")) return;
  const filePath = path.resolve(uploadsDir, path.basename(image));
  if (!filePath.startsWith(`${uploadsDir}${path.sep}`)) return;
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

const buildCarData = (body, isUpdate = false) => {
  const data = {};
  for (const field of editableFields) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  if (!isUpdate && (!data.name || data.pricePerDay === undefined)) {
    throw new ApiError(400, "Le nom et le prix par jour sont requis");
  }
  if (data.name !== undefined) {
    if (typeof data.name !== "string" || !data.name.trim()) throw new ApiError(400, "Le nom est invalide");
    data.name = data.name.trim();
  }
  if (data.pricePerDay !== undefined) {
    if (data.pricePerDay === null || (typeof data.pricePerDay === "string" && !data.pricePerDay.trim())) {
      throw new ApiError(400, "Le prix par jour est requis et doit être un nombre");
    }
    data.pricePerDay = Number(data.pricePerDay);
    if (!Number.isFinite(data.pricePerDay) || data.pricePerDay < 0) {
      throw new ApiError(400, "Le prix par jour doit être un nombre positif ou nul");
    }
  }
  for (const field of ["fuelType", "transmission", "category", "tag", "image"]) {
    if (data[field] !== undefined && typeof data[field] !== "string") {
      throw new ApiError(400, `${fieldLabels[field]} doit être une chaîne de caractères`);
    }
    if (typeof data[field] === "string") data[field] = data[field].trim();
  }
  if (data.options !== undefined) data.options = normalizeOptions(data.options);
  if (Object.keys(data).length === 0) throw new ApiError(400, "Aucun champ voiture modifiable fourni");
  return data;
};

exports.uploadImage = async (req, res) => {
  if (!req.file) throw new ApiError(400, "Aucun fichier image fourni");
  const imagePath = await uploadCarImage(req.file);
  res.status(201).json({ path: imagePath });
};

exports.createCar = async (req, res) => {
  const car = await Car.create(buildCarData(req.body));
  res.status(201).json(car);
};

exports.getCars = async (req, res) => {
  const { category, fuelType, tag, minPrice, maxPrice } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (fuelType) filter.fuelType = fuelType;
  if (tag) filter.tag = tag;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.pricePerDay = {};
    if (minPrice !== undefined) {
      if (!minPrice.trim()) throw new ApiError(400, "minPrice invalide");
      filter.pricePerDay.$gte = Number(minPrice);
      if (!Number.isFinite(filter.pricePerDay.$gte) || filter.pricePerDay.$gte < 0) {
        throw new ApiError(400, "minPrice invalide");
      }
    }
    if (maxPrice !== undefined) {
      if (!maxPrice.trim()) throw new ApiError(400, "maxPrice invalide");
      filter.pricePerDay.$lte = Number(maxPrice);
      if (!Number.isFinite(filter.pricePerDay.$lte) || filter.pricePerDay.$lte < 0) {
        throw new ApiError(400, "maxPrice invalide");
      }
    }
    if (filter.pricePerDay.$gte !== undefined && filter.pricePerDay.$lte !== undefined &&
        filter.pricePerDay.$gte > filter.pricePerDay.$lte) {
      throw new ApiError(400, "minPrice ne peut pas dépasser maxPrice");
    }
  }
  res.json(await Car.find(filter).sort({ createdAt: -1 }).lean());
};

exports.getCarById = async (req, res) => {
  validateId(req.params.id);
  const car = await Car.findById(req.params.id).lean();
  if (!car) throw new ApiError(404, "Voiture introuvable");
  res.json(car);
};

exports.updateCar = async (req, res) => {
  validateId(req.params.id);
  const update = buildCarData(req.body, true);
  const existing = await Car.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Voiture introuvable");
  const previousImage = existing.image;
  Object.assign(existing, update);
  await existing.save();
  if (update.image && update.image !== previousImage) await removeLocalImage(previousImage);
  res.json(existing);
};

exports.deleteCar = async (req, res) => {
  validateId(req.params.id);
  if (await Reservation.exists({ carId: req.params.id, status: { $ne: "cancelled" } })) {
    throw new ApiError(409, "Cette voiture possède des réservations actives");
  }
  const car = await Car.findByIdAndDelete(req.params.id);
  if (!car) throw new ApiError(404, "Voiture introuvable");
  await Reservation.deleteMany({ carId: car._id, status: "cancelled" });
  await removeLocalImage(car.image);
  res.json({ success: true, message: "Voiture supprimée", id: car._id });
};

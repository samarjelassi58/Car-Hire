const express = require("express");
const router = express.Router();
const carController = require("../controllers/car.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// prepare upload directory
const uploadDir = path.join(__dirname, "..", "uploads", "cars");
try {
	fs.mkdirSync(uploadDir, { recursive: true });
} catch (e) {
	console.error("Could not create upload dir", e);
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const unique = Date.now() + "_" + file.originalname.replace(/\s+/g, "_");
		cb(null, unique);
	},
});

const upload = multer({ storage });

// Public routes for cars
router.post("/createCar", carController.createCar);
router.get("/getCars", carController.getCars);
router.get("/getCar/:id", carController.getCarById);
router.put("/updateCar/:id", carController.updateCar);
router.delete("/deleteCar/:id", carController.deleteCar);

// Upload single image. Field name expected: 'image'
router.post("/uploadImage", upload.single("image"), carController.uploadImage);

module.exports = router;

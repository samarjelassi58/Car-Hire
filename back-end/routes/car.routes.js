const express = require("express");
const router = express.Router();
const carController = require("../controllers/car.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/role");

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
		const extensionByType = {
			"image/jpeg": ".jpg",
			"image/png": ".png",
			"image/webp": ".webp",
		};
		const extension = extensionByType[file.mimetype];
		cb(null, `${crypto.randomUUID()}${extension}`);
	},
});

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: function (req, file, cb) {
		if (!allowedImageTypes.has(file.mimetype)) {
			return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
		}
		cb(null, true);
	},
});

const handleImageUpload = (req, res, next) => {
	upload.single("image")(req, res, async (error) => {
		if (error instanceof multer.MulterError) {
			const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
			return res.status(status).json({ message: error.message });
		}
		if (error) {
			if (error.message === "Only JPEG, PNG, and WebP images are allowed") {
				return res.status(400).json({ message: error.message });
			}
			return next(error);
		}
		if (req.file) {
			try {
				const handle = await fs.promises.open(req.file.path, "r");
				const header = Buffer.alloc(12);
				let bytesRead;
				try {
					({ bytesRead } = await handle.read(header, 0, header.length, 0));
				} finally {
					await handle.close();
				}
				const bytes = header.subarray(0, bytesRead);
				const validImage =
					(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) ||
					(bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
					(bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP");
				if (!validImage) {
					await fs.promises.unlink(req.file.path);
					return res.status(400).json({ message: "Fichier image invalide" });
				}
			} catch (fileError) {
				return next(fileError);
			}
		}
		next();
	});
};

// Public read routes
router.get("/getCars", carController.getCars);
router.get("/getCar/:id", carController.getCarById);

// Administrative routes
router.post("/createCar", auth, requireRole(["admin"]), carController.createCar);
router.put("/updateCar/:id", auth, requireRole(["admin"]), carController.updateCar);
router.delete("/deleteCar/:id", auth, requireRole(["admin"]), carController.deleteCar);
router.post("/uploadImage", auth, requireRole(["admin"]), handleImageUpload, carController.uploadImage);

module.exports = router;

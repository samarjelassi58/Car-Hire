
const Car = require("../models/Car");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, "..", "uploads", "cars");
try {
	fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
	console.error("Could not create uploads directory", e);
}

// Handle image upload response (route uses multer middleware)
const uploadImage = async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ message: "No file uploaded" });
		// Return the public path that can be used by frontend
		const publicPath = `/uploads/cars/${req.file.filename}`;
		return res.json({ path: publicPath });
	} catch (err) {
		console.error("uploadImage error:", err);
		return res.status(500).json({ message: "Server error", error: err.message });
	}
};

// Create a new car
const createCar = async (req, res) => {
	try {
		const {
			name,
			pricePerDay,
			fuelType,
			category,
			tag,
			options,
			image,
			reservedPeriods
		} = req.body;

		// Basic validation
		if (!name || pricePerDay == null) {
			return res.status(400).json({ message: "name and pricePerDay are required" });
		}

		const car = new Car({
			name,
			pricePerDay,
			fuelType,
			category,
			tag,
			options: Array.isArray(options) ? options : (options ? [options] : []),
			image,
			reservedPeriods: Array.isArray(reservedPeriods) ? reservedPeriods : []
		});

		const saved = await car.save();
		return res.status(201).json(saved);
	} catch (err) {
		console.error("createCar error:", err);
		return res.status(500).json({ message: "Server error", error: err.message });
	}
};

// Get all cars (with optional query filters)
const getCars = async (req, res) => {
	try {
		const { category, fuelType, tag, minPrice, maxPrice } = req.query;
		const filter = {};
		if (category) filter.category = category;
		if (fuelType) filter.fuelType = fuelType;
		if (tag) filter.tag = tag;
		if (minPrice || maxPrice) filter.pricePerDay = {};
		if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
		if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);

		const cars = await Car.find(filter).sort({ createdAt: -1 });
		return res.json(cars);
	} catch (err) {
		console.error("getCars error:", err);
		return res.status(500).json({ message: "Server error", error: err.message });
	}
};

// Get single car by id
const getCarById = async (req, res) => {
	try {
		const { id } = req.params;
		const car = await Car.findById(id);
		if (!car) return res.status(404).json({ message: "Car not found" });
		return res.json(car);
	} catch (err) {
		console.error("getCarById error:", err);
		return res.status(500).json({ message: "Server error", error: err.message });
	}
};

// Update a car
const updateCar = async (req, res) => {
	try {
		const { id } = req.params;
		const update = { ...req.body };

		// If image is being changed, remove the old image from disk (if local)
		if (update.image) {
			// fetch existing car to compare image paths
			const existing = await Car.findById(id).lean();
			if (existing && existing.image && existing.image !== update.image) {
				// only delete if the existing image is in our uploads folder
				if (existing.image.startsWith("/uploads/") || existing.image.includes("uploads/cars")) {
					const rel = existing.image.replace(/^\//, "");
					const filePath = path.join(__dirname, "..", rel);
					try {
						await fs.promises.unlink(filePath);
						console.log("Deleted old image:", filePath);
					} catch (e) {
						if (e.code !== "ENOENT") console.error("Failed to delete old image", e);
					}
				}
			}
		}

		// Normalize options/reservedPeriods if provided
		if (update.options && !Array.isArray(update.options)) {
			update.options = [update.options];
		}
		if (update.reservedPeriods && !Array.isArray(update.reservedPeriods)) {
			update.reservedPeriods = [update.reservedPeriods];
		}

		const updated = await Car.findByIdAndUpdate(id, update, { new: true, runValidators: true });
		if (!updated) return res.status(404).json({ message: "Car not found" });
		return res.json(updated);
	} catch (err) {
		console.error("updateCar error:", err);
		return res.status(500).json({ message: "Server error", error: err.message });
	}
};

// Delete a car
const deleteCar = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await Car.findByIdAndDelete(id);
		if (!deleted) return res.status(404).json({ message: "Car not found" });

		// delete associated image file if it's a local upload
		if (deleted.image && (deleted.image.startsWith("/uploads/") || deleted.image.includes("uploads/cars"))) {
			const rel = deleted.image.replace(/^\//, "");
			const filePath = path.join(__dirname, "..", rel);
			try {
				await fs.promises.unlink(filePath);
				console.log("Deleted image file:", filePath);
			} catch (e) {
				if (e.code !== "ENOENT") console.error("Failed to delete image file", e);
			}
		}

		return res.json({ message: "Car deleted", id: deleted._id });
	} catch (err) {
		console.error("deleteCar error:", err);
		return res.status(500).json({ message: "Server error", error: err.message });
	}
};

module.exports = {
	createCar,
	getCars,
	getCarById,
	updateCar,
	deleteCar,
	uploadImage
};

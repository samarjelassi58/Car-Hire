const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");

const validateImageStorage = () => {
  const mode = process.env.IMAGE_STORAGE || "local";
  if (!["local", "cloudinary"].includes(mode)) {
    throw new Error("IMAGE_STORAGE doit être local ou cloudinary");
  }
  if (mode === "cloudinary" && !process.env.CLOUDINARY_URL) {
    throw new Error("CLOUDINARY_URL est requis pour le stockage Cloudinary");
  }
  return mode;
};

const uploadCarImage = async (file) => {
  if (validateImageStorage() === "local") return `/uploads/cars/${file.filename}`;

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "car-hire",
      resource_type: "image",
    });
    if (!result.secure_url || !result.secure_url.startsWith("https://")) {
      throw new Error("Cloudinary n'a pas renvoyé d'URL sécurisée");
    }
    return result.secure_url;
  } finally {
    await fs.promises.unlink(file.path);
  }
};

module.exports = { uploadCarImage, validateImageStorage };

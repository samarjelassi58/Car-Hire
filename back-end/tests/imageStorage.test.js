const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { v2: cloudinary } = require("cloudinary");
const { uploadCarImage, validateImageStorage } = require("../services/imageStorage");

test("stockage local et validation de la configuration", async (t) => {
  const oldMode = process.env.IMAGE_STORAGE;
  const oldUrl = process.env.CLOUDINARY_URL;
  t.after(() => {
    if (oldMode === undefined) delete process.env.IMAGE_STORAGE;
    else process.env.IMAGE_STORAGE = oldMode;
    if (oldUrl === undefined) delete process.env.CLOUDINARY_URL;
    else process.env.CLOUDINARY_URL = oldUrl;
  });

  process.env.IMAGE_STORAGE = "local";
  assert.equal(await uploadCarImage({ filename: "voiture.png" }), "/uploads/cars/voiture.png");
  process.env.IMAGE_STORAGE = "cloudinary";
  delete process.env.CLOUDINARY_URL;
  assert.throws(validateImageStorage, /CLOUDINARY_URL/);
  process.env.IMAGE_STORAGE = "invalide";
  assert.throws(validateImageStorage, /IMAGE_STORAGE/);
});

test("stockage Cloudinary : URL sécurisée et nettoyage même en cas d'échec", async (t) => {
  const oldMode = process.env.IMAGE_STORAGE;
  const oldUrl = process.env.CLOUDINARY_URL;
  process.env.IMAGE_STORAGE = "cloudinary";
  process.env.CLOUDINARY_URL = "cloudinary://example:example@example";
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "car-hire-images-"));
  t.after(async () => {
    if (oldMode === undefined) delete process.env.IMAGE_STORAGE;
    else process.env.IMAGE_STORAGE = oldMode;
    if (oldUrl === undefined) delete process.env.CLOUDINARY_URL;
    else process.env.CLOUDINARY_URL = oldUrl;
    await fs.rmdir(directory);
  });
  const upload = t.mock.method(cloudinary.uploader, "upload", async () => ({ secure_url: "https://example.test/voiture.png" }));
  const file = path.join(directory, "test.png");
  await fs.writeFile(file, "test");
  assert.equal(await uploadCarImage({ path: file }), "https://example.test/voiture.png");
  await assert.rejects(fs.access(file), { code: "ENOENT" });

  upload.mock.mockImplementation(async () => { throw new Error("Échec du fournisseur"); });
  await fs.writeFile(file, "test");
  await assert.rejects(uploadCarImage({ path: file }), /Échec du fournisseur/);
  await assert.rejects(fs.access(file), { code: "ENOENT" });
});

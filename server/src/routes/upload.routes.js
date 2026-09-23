const express = require("express");
const multer = require("multer");
const { uploadToBlob, deleteFromBlob } = require("../lib/blob");
const authMiddleware = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Only image files are allowed"));
  },
});

router.post("/image", authMiddleware, requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const ext = req.file.originalname ? req.file.originalname.split(".").pop() : "png";
    const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const blobUrl = await uploadToBlob(req.file.buffer, {
      filename,
      contentType: req.file.mimetype,
    });

    return res.status(201).json({ url: blobUrl });
  } catch (error) {
    return next(error);
  }
});

router.delete("/image", authMiddleware, requireAdmin, async (req, res, next) => {
  try {
    const { url } = req.body || {};
    if (!url) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    await deleteFromBlob(url);
    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
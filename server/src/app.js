const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const trackRoutes = require("./routes/track.routes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const uploadRoutes = require("./routes/upload.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header("Origin");

  if (!origin) {
    return callback(null, { origin: true });
  }

  const allowedExtra = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const isVercelFrontend = /https:\/\/.*\.(vercel\.app|vercel\.site)$/.test(origin);

  let originHost;
  try {
    originHost = new URL(origin).host;
  } catch {
    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  }

  const sameHost = originHost === req.get("host");
  const isLocalDev = ["http://localhost:5173", "http://127.0.0.1:5173"].includes(origin);
  const isAllowedExtra = allowedExtra.includes(origin);

  if (sameHost || isLocalDev || isAllowedExtra || isVercelFrontend) {
    return callback(null, { origin: true });
  }

  return callback(new Error(`Origin not allowed by CORS: ${origin}`));
};

// 1. Global middleware
app.use(cors(corsOptionsDelegate));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Ensure MongoDB connection before handling any request (needed for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// 2. Routes
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);

// 3. Error handling — must be LAST
app.use(notFound);
app.use(errorHandler);

module.exports = app;
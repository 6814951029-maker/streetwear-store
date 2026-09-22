const express = require("express");
const cors = require("cors");
const trackRoutes = require("./routes/track.routes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
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

  let originHost;
  try {
    originHost = new URL(origin).host;
  } catch {
    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  }

  const sameHost = originHost === req.get("host");
  const isLocalDev = origin === "http://localhost:5173";
  const isAllowedExtra = allowedExtra.includes(origin);

  if (sameHost || isLocalDev || isAllowedExtra) {
    return callback(null, { origin: true });
  }

  return callback(new Error(`Origin not allowed by CORS: ${origin}`));
};

// 1. Global middleware
app.use(cors(corsOptionsDelegate));
app.use(express.json());
// 2. Routes
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
// 3. Error handling — must be LAST
app.use(notFound);
app.use(errorHandler);

module.exports = app;
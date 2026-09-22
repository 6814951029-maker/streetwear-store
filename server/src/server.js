require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
const startServer = () => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};

if (process.env.MONGO_URI) {
  connectDB().then(startServer).catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    startServer();
  });
} else {
  startServer();
}

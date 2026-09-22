const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = () => {
  if (connectionPromise) {
    return connectionPromise;
  }

  if (!process.env.MONGO_URI) {
    return Promise.reject(new Error("MONGO_URI is not set"));
  }

  connectionPromise = mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      console.log("MongoDB connected");
      return conn;
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};

module.exports = connectDB;
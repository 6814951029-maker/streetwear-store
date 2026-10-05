require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("../models/Order");

async function backfillCodOrders() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");

  await mongoose.connect(process.env.MONGO_URI);
  const result = await Order.updateMany(
    { paymentMethod: { $ne: "cod" } },
    { $set: { paymentMethod: "cod" } }
  );
  console.log(`Updated ${result.modifiedCount} existing order(s) to cash on delivery.`);
  await mongoose.disconnect();
}

backfillCodOrders().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
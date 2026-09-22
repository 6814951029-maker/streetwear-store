require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");

const [currentEmail, newEmail, newPassword, username = "admin", fullName = "Store Admin"] = process.argv.slice(2);

async function updateAdmin() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  if (!currentEmail || !newEmail || !newPassword) {
    throw new Error("Usage: npm run update:admin -- current@email.com new@email.com new-password [username] [fullName]");
  }
  if (newPassword.length < 8) throw new Error("Admin password must be at least 8 characters");

  await mongoose.connect(process.env.MONGO_URI);
  const current = await User.findOne({ email: currentEmail.trim().toLowerCase() });
  if (!current || current.role !== "admin") throw new Error("Admin account was not found");

  const normalizedNewEmail = newEmail.trim().toLowerCase();
  const duplicate = await User.findOne({ email: normalizedNewEmail, _id: { $ne: current._id } });
  if (duplicate) throw new Error("The new email is already in use");

  current.email = normalizedNewEmail;
  current.username = username.trim();
  current.fullName = fullName.trim();
  current.passwordHash = await bcrypt.hash(newPassword, 10);
  await current.save();
  console.log(`Admin account updated: ${current.email}`);
  await mongoose.disconnect();
}

updateAdmin().catch(async (error) => { console.error(error.message); await mongoose.disconnect(); process.exit(1); });

require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");

const [email, password, username = "admin", fullName = "PORTABLE Admin"] = process.argv.slice(2);

async function seedAdmin() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  if (!email || !password) throw new Error("Usage: npm run create:admin -- admin@example.com a-strong-password [username] [fullName]");
  if (password.length < 8) throw new Error("Admin password must be at least 8 characters");

  await mongoose.connect(process.env.MONGO_URI);
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    { $set: { username: username.trim(), fullName: fullName.trim(), passwordHash, role: "admin" } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  console.log(`Admin account ready: ${user.email}`);
  await mongoose.disconnect();
}

seedAdmin().catch(async (error) => { console.error(error.message); await mongoose.disconnect(); process.exit(1); });

require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");

const [emailInput, newPassword] = process.argv.slice(2);

async function resetUserPassword() {
  if (!emailInput || !newPassword) {
    throw new Error("Usage: npm run reset:user-password -- <email> <new-password>");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  if (newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const normalizedEmail = emailInput.trim().toLowerCase();
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw new Error(`User not found for email: ${normalizedEmail}`);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = passwordHash;
  await user.save();

  const matchesLoginCheck = await bcrypt.compare(newPassword, user.passwordHash);
  console.log(`Password reset for ${user.email}`);
  console.log(`Hash matches login compare: ${matchesLoginCheck}`);

  if (!matchesLoginCheck) {
    throw new Error("Password reset failed validation: bcrypt.compare returned false");
  }

  await mongoose.disconnect();
}

resetUserPassword()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error(error.message);
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      // no-op
    }
    process.exit(1);
  });

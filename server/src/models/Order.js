const mongoose = require("mongoose");

const shippingAddressSchema = new mongoose.Schema({
  recipientName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  addressLine: { type: String, required: true, trim: true },
  subdistrict: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  province: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ productId: String, name: String, image: String, price: Number, quantity: { type: Number, min: 1 } }],
  shippingAddress: { type: shippingAddressSchema, required: true },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cod"], default: "cod", required: true },
  status: { type: String, enum: ["pending", "paid", "packing", "shipped", "completed", "cancelled"], default: "pending" },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("Order", orderSchema);
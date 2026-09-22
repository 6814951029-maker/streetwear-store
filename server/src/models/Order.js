const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({ customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, items: [{ productId: String, name: String, image: String, price: Number, quantity: { type: Number, min: 1 } }], total: Number, status: { type: String, enum: ["pending", "paid", "packing", "shipped", "completed", "cancelled"], default: "pending" } }, { timestamps: true, versionKey: false });
module.exports = mongoose.model("Order", orderSchema);

const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({ id: { type: String, required: true, unique: true }, name: { type: String, required: true }, nameTh: String, style: String, category: { type: String, enum: ["clothing", "bags"] }, price: { type: Number, min: 0 }, stock: { type: Number, min: 0, default: 0 }, colors: [String], badge: String, image: { type: String, required: true } }, { timestamps: true, versionKey: false });
module.exports = mongoose.model("Product", productSchema);

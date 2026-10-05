const Order = require("../models/Order");
const Product = require("../models/Product");

const ADDRESS_FIELDS = ["recipientName", "phone", "addressLine", "subdistrict", "district", "province", "postalCode"];

const createOrder = async (req, res, next) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ message: "Cart is empty" });
    const suppliedAddress = req.body?.shippingAddress || {};
    const shippingAddress = Object.fromEntries(ADDRESS_FIELDS.map((field) => [field, String(suppliedAddress[field] || "").trim()]));
    if (ADDRESS_FIELDS.some((field) => !shippingAddress[field])) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }

    const rows = [];
    for (const item of items) {
      const product = await Product.findOne({ id: item.id });
      const quantity = Math.max(1, Number(item.quantity || 1));
      if (!product || product.stock < quantity) {
        return res.status(400).json({ message: `สินค้า ${item.name || item.id} มีไม่พอ` });
      }
      product.stock -= quantity;
      await product.save();
      rows.push({ productId: product.id, name: product.name, image: product.image, price: product.price, quantity });
    }

    const subtotal = rows.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal === 0 || subtotal >= 1500 ? 0 : 120;
    const order = await Order.create({ customer: req.user.userId, items: rows, shippingAddress, subtotal, shippingFee, total: subtotal + shippingFee, paymentMethod: "cod" });
    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    res.json({ orders: await Order.find({ customer: req.user.userId }).sort({ createdAt: -1 }) });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    res.json({ orders: await Order.find().populate("customer", "email fullName username").sort({ createdAt: -1 }) });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const status = req.body.status;
    if (!["pending", "paid", "packing", "shipped", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrders, updateOrder };
const mongoose = require("mongoose");

// create order schema
const orderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

// Create order instance
const Order = new mongoose.model("Orders", orderSchema);

module.exports = Order;

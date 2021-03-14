const mongoose = require("mongoose");

// create product schema
const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productImg: {
    type: String,
    require: true,
  },
});

// Create product instance
const Product = new mongoose.model("Products", productSchema);

module.exports = Product;

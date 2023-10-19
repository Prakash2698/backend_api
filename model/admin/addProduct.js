const mongoose = require("mongoose");

const addProduct = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique: true
  },
  productImage: {
    type: Buffer,
    required: true,
  },
  productPrice: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true
  },
  description:{
    type: String,
  },
  active: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

module.exports = mongoose.model('addProduct', addProduct);

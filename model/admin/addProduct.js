const mongoose = require("mongoose");

const addProduct = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique: true
  },
  category:{
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  description:{
    type: String,
  },
  productLink: {
    type: String, // Store the download link here
    required: true, // You can make it optional if needed
  },
  active: {
    type: Boolean,
    default: false
  },

}, { timestamps: true });

module.exports = mongoose.model('Product', addProduct);

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
    type: Buffer,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  description:{
    type: String,
  },
  // userId:{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref:'user'
  
  // },
  // orderID:{
  //   type: String, // or type: Number, depending on your use case
  //   required: true, // if it's a required field
  //   unique: true, // if you want to ensure unique order IDs
  // },
  active: {
    type: Boolean,
    default: false
  },

}, { timestamps: true });

module.exports = mongoose.model('Product', addProduct);

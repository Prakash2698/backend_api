const mongoose = require("mongoose");
bcrypt = require('bcrypt');
const user1Schema = new mongoose.Schema({
  // Reference to the user who placed the order
  partnerId: {
    type: String,
    // required: true,
  },
  // Reference to the product in the order
  productId: { 
    type: mongoose.Schema.Types.ObjectId, ref: "Product" 
  },

  quantity: Number,

  totalPrice: Number,
  
  status: {
    type: String,
    enum: ['sucess', 'pending'],
    default: 'pending'
  },
  created: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("order", user1Schema);

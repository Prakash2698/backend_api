const mongoose = require("mongoose");
bcrypt = require('bcrypt');
const service = new mongoose.Schema({
  // Reference to the user who placed the order
  partnerId: {
    type: String,
    required: true,
  },
  // Reference to the product in the order
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "eStamp"
  },
  // quantity: Number,
  validity: {
    type: String,
    enum: ['7days', 'monthly', 'yearly', 'five_years', 'life_time'],
    // default:'7days',
    required: true,
  },
  totalPrice: {
    type: Number
  },
  status: {
    type: String,
    enum: ['sucess', 'pending', "reject"],
    default: 'pending'
  },
  created: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("orderEstamService", service);

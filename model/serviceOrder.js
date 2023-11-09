const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  activationPrice: {
    type: Number,
    required: true,
  },
  perHitCharge: {
    type: Number,
  },
  limit_hit: {
    type: Number,
  },
  orderId: {
    type: String,
    required: true,
  },
  validity: {
    type: String,
    enum: ['7days', 'monthly', 'yearly', 'five_years', 'life_time'],
    required: true,
  },
  startedAt: {
    type: Date,
    default: Date.now, // Set to the current date and time when created
  },
  expiresAt: {
    type: Date,
  },
 
});

module.exports = mongoose.model('ServiceOrder', orderSchema);

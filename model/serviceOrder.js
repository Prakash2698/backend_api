const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming the service ID is an ObjectId
        required: true,
    },
    activationPrice: {
        type: Number,
        required: true,
    },
    perHitCharge:{
        type:Number
    },
    limit_hit:{
        type:Number
    },
    orderId: {
        type: String,
        required: true,
    },
    validity: {
        type: String,
        enum: ['7days', 'monthly', 'yearly', 'five_years', 'life_time'],
        required: true,
    }
});

module.exports = mongoose.model('ServiceOrder', orderSchema);

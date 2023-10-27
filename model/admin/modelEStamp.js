const mongoose = require('mongoose');
const model_eStamp = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
    },
    perHitCharge: {
        type: Number,
        required: true
    },
    validity: {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    activationTime: {
        type: Date,
        default: Date.now,
    },
    
});

module.exports = mongoose.model('eStamp', model_eStamp);

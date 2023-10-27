// const mongoose = require('mongoose');
// const model_eStamp = new mongoose.Schema({
//     price: {
//         type: Number,
//         required: true,
//     },
//     perHitCharge: {
//         type: Number,
//         required: true
//     },
//     validity: {
//         type: String,
//         enum: ['monthly', 'yearly', 'five_years', 'life_time'],
//         required: true,
//     },
//     activationTime: {
//         type: Date,
//         default: Date.now,
//     },

// });

// module.exports = mongoose.model('eStamp', model_eStamp);
const mongoose = require('mongoose');

const model_eStamp = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
    },
    perHitCharge: {
        type: Number,
        required: true,
        min: 0, // Minimum perHitCharge value
    },
    validity: {
        type: String,
        enum: ['7days','monthly', 'yearly', 'five_years', 'life_time'],
        // default:'7days',
        required: true,
    },
    monthly_hit: {
        type: Number,
        default: 20, // Default value of 20
        required: true,
    },
    activationTime: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('eStamp', model_eStamp);


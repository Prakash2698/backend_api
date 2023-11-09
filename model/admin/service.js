const mongoose = require('mongoose');

const model_eStamp = new mongoose.Schema({
    SName:{
        type:String,
        required:true
    },
    activationPrice: {
        type: Number,
        // required: true,
    },
    type:{
        perHitCharge: {
            type: Number,
        },
        hit_limit: {
            type: Number
        },
    },
  
    validity: {
        type: String,
        enum: ['7days','monthly', 'yearly', 'five_years', 'life_time'],
        required: true,
    },
    description:{
    type:String
    },
    
    created: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('service', model_eStamp);


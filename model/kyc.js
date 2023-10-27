const mongoose = require("mongoose");
const kycSchema = new mongoose.Schema({
    aadharNo: {
        type: String,
        required: true,
        unique: true
    },
    panNo: {
        type: String,
        required: true,
        unique: true
    },
    aadharFrontImage: {
        type: String,
        required: true,
    },
    aadharBackImage: {
        type: String,
        required: true,
    },
    panImage: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'pending'],
        default: 'pending'
    }  ,
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
  userStatus:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
}



},{ timestamps: true })

module.exports = mongoose.model("kyc", kycSchema);
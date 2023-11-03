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
    GST_Number: {
        type: String
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
    DOB: {
        type: Date,
        required: true
    },
    Address: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        Pin_Code: { type: String, required: true },
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
   kycStatus: {
        type: String,
        enum: ['rejected', 'Approved', 'pending'],
        default: 'pending'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    userStatus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }

}, { timestamps: true })

module.exports = mongoose.model("kyc", kycSchema);
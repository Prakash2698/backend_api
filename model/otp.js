const mongoose = require("mongoose");
const OtpSchema = mongoose.Schema({
    phone: {
        type: String,
        trim: true,
        require: true
    },
    otp: {
        type: Number,
        require: true
    },
    isVerify: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
});

module.exports = mongoose.model("otp", OtpSchema);

const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order", // Reference the "order" model
    },
    userId: { // Add a field for the user ID
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Reference the "user" model
    },
    paymentId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true, // Correct the 'require' to 'required'
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['failed', 'confirmed'], // Correct 'sucess' to 'success'
        default: 'failed',
    }
});

module.exports = mongoose.model("razorpay", PaymentSchema);

const mongoose = require("mongoose");
// Define a MongoDB model for payments
const Payment = mongoose.Schema('Payment', {
    amount: Number,
    status: String,
});

module.exports = mongoose.model("razorpay", Payment);

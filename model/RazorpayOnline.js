const mongoose = require("mongoose");
// Define a Mongoose model for storing payment details
const Payment = mongoose.Schema({
    // orderId: {
    //     type: String,
    // },
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, ref: "order" 
    },
    paymentId: {
        type: String,
    },
    amout: {
        type: Number,
        require: true
    },
    description:{
        type: String,
    },
    status: {
        type: String,
        enum: ['failed','sucess'],
    }
});

module.exports = mongoose.model("razorpay", Payment);

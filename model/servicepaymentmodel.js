const mongoose = require("mongoose");

const servicePayment = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "eStamp"
      },
    partnerId: {
        type: String, // Define partnerId as a string
        required: true
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

module.exports = mongoose.model("servicePayment", servicePayment);

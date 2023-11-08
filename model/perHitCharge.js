const mongoose = require("mongoose");

const mongoDB = new mongoose.Schema({
    perHitCharge: {
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Reference the "user" model
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model("perHitCharge_History", mongoDB);
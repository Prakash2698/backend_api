const mongoose = require("mongoose");

const walletSchema =new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // You can customize this based on your user model
        ref: 'User', // Reference to the user model
      },
  addAmount:{
    type: Number,
    default: 0,
   }
})

module.exports = mongoose.model('wallet_Amount',walletSchema);

const mongoose = require("mongoose");
bcrypt = require('bcrypt');
const user1Schema = new mongoose.Schema({
  // Reference to the user who placed the order
  userId: { 
    type: mongoose.Schema.Types.ObjectId, ref: "user" 
},
// Reference to the product in the order
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, 
  quantity: Number,
  totalPrice: Number,
 

});

module.exports = mongoose.model("order", user1Schema);

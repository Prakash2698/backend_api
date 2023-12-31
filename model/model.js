const mongoose = require("mongoose");
// console.log("schema>>>>>>>>>>");
bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  profileImage:{
   type:String,
   default:""
  },
  name: {
    type: String,
    required: true,
    unique:true
  },
  phone: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
   type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  partnerId:{
    type: String,
    unique: true,
    required: true
  },
  wallet_amount: {
    type: Number, // Define wallet_amount as a numerical field
    default: 0 // You can set a default value if needed
  },
  token: { 
    type: String 
  },
  apiKey:{
    type: String
  },
  userStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
}  ,
adminFile:{
  type:String,
  default:""
},
// kyc: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'kyc' // Reference to the 'get_profile' model
// },
  created: {
    type: Date,
    default: Date.now
  },

});
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};

module.exports = mongoose.model("user", userSchema);

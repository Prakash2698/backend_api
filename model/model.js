const mongoose = require("mongoose");
// console.log("schema>>>>>>>>>>");
bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
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
  token: { 
    type: String 
  },
  userStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
}  ,
  created: {
    type: Date,
    default: Date.now
  }
});
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.hash_password);
};

module.exports = mongoose.model("user", userSchema);

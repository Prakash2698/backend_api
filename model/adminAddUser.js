const mongoose = require("mongoose");

const adminAdduser =new mongoose.Schema({
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
        required: true
      },
      token: { 
        type: String,
        require:true
      }, 
})

module.exports = mongoose.model('adduseradmin',adminAdduser);

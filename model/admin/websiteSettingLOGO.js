const mongoose = require("mongoose");
const web_logo = new mongoose.Schema({
  // Reference to the user who placed the order
  name: {
    type: String,
    required: true,
  },
  logo: {        // for logo Image
    type: String,
    // required: true,
  },
  newLogo:{
    type: String,
  },
  websiteIS:{   
    type:String,
    enum:['maintance','live']
  },  
  created: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("logo", web_logo);

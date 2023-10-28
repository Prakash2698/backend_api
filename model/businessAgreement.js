const mongoose = require("mongoose");
const Business_Agreement = new mongoose.Schema({
    businessRegistrationProof: {
    type: String,
    require: true,
  },
  business_PAN_CARD: {
    type: String,
    require:true
  },
  BusinessGST: {
   type: String
  },
  agreement_file :{
   type:String,
   require:true
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'adduseradmin'
},
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BusinessAgreement", Business_Agreement);

const mongoose = require("mongoose");
const Business_Agreement = new mongoose.Schema({
    businessRegistrationProof: {
    type: Buffer,
    require: true,
  },
  business_PAN_CARD: {
    type: Buffer,
  
  },
  BusinessGST: {
   type: Buffer
  },
  agreement_file :{
   type:Buffer,
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

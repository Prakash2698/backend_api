const mongoose = require("mongoose");
const clientSend = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  partnerId:{
    type: String,
    unique: true,
    required: true
  },
    pdfImage:{     //1
        type: String,
        // require:true
      },
      Stamp_Duty_Value: {   //2
        type: String,
        // required: true, 
      },
      First_Party_Name:{  //3
          type:String,
        //   required:true
      },
      Second_Party_Name:{   //4
        type:String,   
        //   required:true
      },
      Consideration_Price:{   //5
        type:String,
        //   required:true
      },
      Purpose_of_Stamp_Duty:{    // 6
        type:String,
        //   required:true
      },
      Stamp_Duty_Paid_By:{   //7
        type:String,
        // required:true
      },
  estamp:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'estamp'
},
  created: {
    type: Date,
    default: Date.now
  },
//   ============================================================
status:{
    type: String,
    enum:["pending","reject","sucess"],
    default:"pending"
  },
});

module.exports = mongoose.model("client_Send_data", clientSend);

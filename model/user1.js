// const mongoose = require("mongoose");
// bcrypt = require('bcrypt');
// const user1Schema = new mongoose.Schema({
//   products: [{
//     productId :{ 
//       type:Object,
//       required:true
//     }
//   }
//   ], 
//   totalAmount:{
//        type:String
//   } ,
//   status: {
//     type: String,
//     enum: ['sucess', 'pending'],
//     default: 'pending'
//   },
//   created: {
//     type: Date,
//     default: Date.now
//   }

// });

// module.exports = mongoose.model("order", user1Schema);




// // const mongoose = require("mongoose");
// // bcrypt = require('bcrypt');
// // const user1Schema = new mongoose.Schema({
// //   // Reference to the user who placed the order
// //   // partnerId: {
// //   //   type: String,
// //   //   // required: true,
// //   // },
// //   // Reference to the product in the order
// //   products: [{
// //     productId :{ 
// //       type:Object,
// //       required:true
// //     }
// //   }
// //   ],
// //   // { 
// //   //   type: mongoose.Schema.Types.ObjectId, ref: "Product" 
// //   // },

// //   // quantity: Number,

// //   // totalPrice: Number,

// //   status: {
// //     type: String,
// //     enum: ['sucess', 'pending'],
// //     default: 'pending'
// //   },
// //   created: {
// //     type: Date,
// //     default: Date.now
// //   }

// // });

// // module.exports = mongoose.model("order", user1Schema);



const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      totalPrice: { // Add totalPrice field to the products array
        type: Number,
        required: true,
      },
    },
  ],
  orderId: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'failed', 'confirmed'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);


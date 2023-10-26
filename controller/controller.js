const newuserSchema = require("../model/model");
const bcrypt = require("bcrypt"); // Import the bcrypt library
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const common = require("../config/common");
const helper = require("../helper/helper");
const OtpSchema = require("../model/otp");
const productList = require("../model/admin/addProduct");
const kycSchema = require("../model/kyc");
const user1Schema = require("../model/user1");
const orders = require('../model/user1');
const Product = require("../model/admin/addProduct");
const Razorpay = require('razorpay');
const Token = require('../model/model');
const paymentModel = require('../model/RazorpayOnline');
const wallet_amount = require("../model/addMoney");
const Notification = require("../model/notificationBar");

// ============================= start Signup start ====================================
const createuser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        if (!email) {
            res.status(400).send({ success: false, msg: "Email is required" });
            return;
        }
        if (!password) {
            res.status(400).send({ success: false, msg: "Password is required" });
            return;
        }

        // Generate a unique partner ID (you can use a library like `uuid` for this)
        const partnerId = helper.generatePartnerId();

        // Check if the email already exists in the database
        const userData = await newuserSchema.findOne({ email: email } && { phone: phone });

        if (userData) {
            res.status(201).send({ success: false, msg: "Email or phone already exists" });
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = new newuserSchema({
                name,
                phone,
                email,
                partnerId, // Set the partnerId
                password: hashedPassword
            });

            // Save the new user to the database
            const user_data = await newUser.save();

            // Send an email with the partnerId
            const transporter = nodemailer.createTransport({
                host: 'weberse.in',
                port: 465,
                secure: true,
                auth: {
                  user: 'info@weberse.live',
                  pass:'Pp@7884294',
                  authMethod: 'PLAIN', // Specify the authentication method ('LOGIN' or 'PLAIN' for most email providers)
                },
              });
            const mailOptions = {
                from:'info@weberse.live',
                to: email,
                subject: partnerId,
                text: `Your Partner ID is: ${partnerId}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    res.status(400).send({ success: false, msg: "Email sending failed" });
                } else {
                    console.log("Email sent:", info.response);
                    res.status(200).send({ success: true, data: user_data });
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: error.message });
    }
}

// ============================= end Signup ===========================================

// {
//     "name":"vp",
//     "phone":9559602440,
//     "email":"vv@gmail.com",
//     "password":"12344321"
//   }

// ============================= login user start ===========================================
const login = async (req, res) => {
    try {
        const phone = req.body.phone;
        
        const user = await newuserSchema.findOne({ phone: phone });
        if (!user) {
            return res.status(401).json({ message: 'please check your number' });
        }
        const otp = helper.otpGenerate();
        const otpS = new OtpSchema({
            phone,
            otp
        });
        // console.log(phone,otp)
        // Send OTP to the mobile number using MSG91
        const otpSent = await helper.generateOtpWithMSG91({ phone, otp });

        console.log("OTP send on phone number>>>", otpSent);
        const Otp = await otpS.save();
        res.send({ status: 200, message: "sucess", Otp })

    } catch (error) {
        console.log(">>>>>>>>>>>>>>..", error);
        res.status(500).send("somethings went wrong");
    }
}
// ============================= login end ======================================================
// =========================== api user_login ========================================
const user_login = async (req, res) => {
    try {
        const { partnerId, password } = req.body;

        if (!partnerId || !password) {
            return res.status(400).json({ success: false, message: "Both partnerId and password are required" });
        }

        // Find the user in the database by partnerId
        const user = await newuserSchema.findOne({partnerId });
        //   console.log(">>>>>>>>.",user);
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        console.log(user.password)
        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        // console.log("password>>>>>>>>>>>>>>>>>",password);
        console.log(passwordMatch)
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }
        // You can generate a token here for authentication if needed
        res.status(200).json({ success: true, message: "Login successful" , result:user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}
// =========================== api user_login end =====================================

// ============================= verify_otp user start ===========================================
const verifyotp = async (req, res) => {
    try {
        const phone = req.params.phone;
        const otp = req.body.otp;
        // console.log(otp,phone)
        const findotp = await OtpSchema.findOne({ otp: otp, phone: phone });
        // console.log(findotp,">>>>>>>>>>>>...");
        if (!findotp) {
            return res.status(401).json({ message: 'otp_not_found' });
        }
        await common.updateVerifyOtp({ _id: findotp._id }, { $set: { isVerify: true } })
        const user = await newuserSchema.findOne({ phone: req.params.phone })
        if (!user) {
            res.send({ message: "User not found" });
        }
        const { _id, phoneNo } = user
        const token = helper.createJwtToken({ _id, phoneNo });
        res.send({ message: "Otp verify successfully", token: token });
    } catch (error) {
        res.send({ message: "not_found" });
    }
}
// ============================= verify_otp end ===========================================
// const login = async (req, res) => {
//     try {
//       const  phone = req.body;
//   const phoneNo = newuserSchema.findOne({phone:phone})
//       if (!phoneNo) {
//         res.status(400).send("phone_no_not_found");
//       }
// // ==================== otp generate =====================
// const otp = helper.otpGenerate();
// const otpS = new OtpSchema({
//     phone,
//     otp
// });
// console.log(otpS);
// // console.log(phone,otp)
//  // Send OTP to the mobile number using MSG91
//  const otpSent = await helper.generateOtpWithMSG91({ phone , otp});
//      console.log("OTP send on phone number>>>",otpSent);
//     const Otp =  await otpS.save();
//    res.send({status:200, message:"sucess" ,Otp })
//     } catch (err) {
//       console.log(err);
//     }
// }

// ============================= otp_resend start ===========================================
const resendOTP = async (req, res) => {
    try {
        const phone = req.params.phone;
        console.log(phone)
        const user = await OtpSchema.findOne({ phone: phone });
        if (!user) {
            res.send({ status: 401, message: "number Not Found" });
        }
        const otp = helper.otpGenerate();
        const otpS = new OtpSchema({
            phone,
            otp
        });
        // console.log(phone,otp)
        // Send OTP to the mobile number using MSG91
        const otpSent = await helper.generateOtpWithMSG91({ phone, otp });

        console.log("OTP send on phone number>>>", otpSent);
        const Otp = await otpS.save();
        res.send({ status: 200, message: "sucess", Otp })
    } catch (error) {
        res.send({ status: 400, message: "Some error in accessing user data" });
    }
}
// ================   reset-password-request Done ========================================

// Request to initiate password reset - Step 1
const reset_password_request = async (req, res) => {
    try {
        const { partnerId, email } = req.body;
        if (!partnerId || !email) {
            return res.status(400).json({ success: false, message: "Both partnerId and email are required" });
        }
        // Check if the email exists in your database
        const user = await newuserSchema.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token and set an expiry time
        const resetToken = crypto.randomBytes(20).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // 1 hour in milliseconds

        // Save the reset token and expiry time in the user's document
        user.token = resetToken;
        user.tokenExpiry = tokenExpiry;

        // Save the updated user document
        await user.save();

        // Send a password reset email
        const transporter = nodemailer.createTransport({
            // Configure your email provider
            host: 'weberse.in',
            port: 465,
            secure: true,
            auth: {
                user: 'info@weberse.live',
                pass: 'Pp@7884294',
                authMethod: 'PLAIN', // Specify the authentication method ('LOGIN' or 'PLAIN' for most email providers)
            },
        });
        const mailOptions = {
            from: 'info@weberse.live',
            to: email,
            subject: 'Password Reset',
            text: `Click this link to reset your password: http://localhost:8000/reset_password_request/${resetToken}`,
        };
        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: 'Password reset email sent' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while processing your request' });
    }
}

// Reset Password SET
const reset_password_set = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        console.log(">>>>>>>>>",token);
        // Check if the token is valid and hasn't expired
        const user = await newuserSchema.findOne({
            token:token,
            // tokenExpiry: { $gt: Date.now() },
        });
        console.log(">>>>>>>>>>>",user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Allow password reset
        const hashedPassword = bcrypt.hashSync(password, 10);
        // Update the user's password in the database
        await newuserSchema.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            token: null, // Clear the token
            tokenExpiry: null, // Clear the token expiry
        });
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request' });
    }
};

const getProduct = async (req, res) => {
    try {
        const findProduct = await productList.find()
        // console.log(findProduct, ">>>>>>>>>>...");
        if (!findProduct) {
            res.send({ sucess: false, message: "productList_not_found" });
        }
        res.send({ sucess: true, result: findProduct })
    } catch (error) {
        console.log(error)
    }

}


// ============================ user profile ============================
const profile = async (req, res) => {
    try {
        const userId = req.params.userId
        console.log(">>>>>>>>>>>>>>>>>>>",userId);
        const user = await newuserSchema.findById({ _id: userId });
        const kycData = await kycSchema.findOne({ userId: userId });

        if (user && kycData) {
            const userProfile = {
                user,
                kycData,
            };
            // Return userProfile
            res.send({sucess:true,message:"find_user_profile",userProfile})
        } else {            
            // Handle the case where user or kycData is not found
            res.send({sucess:false,message:"user_not_found"})
        }
    } catch (error) {
        console.log(error);
    }
}
// ================ place order api =====================================
const user1 = async(req,res)=>{
      try {
        const { userId, productId, quantity } = req.body;
        // Retrieve product details
        const product = await Product.findById(productId);
      
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }      
        // Calculate total price
        const totalPrice = product.productPrice * quantity;
      
        // Create a new order
        const order = new user1Schema({
          userId,
          productId,
          quantity,
          totalPrice,
        });
      
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
        
      } catch (error) {
        console.log(error);
      }   
  };
 
//   ============== order history ===========================================
const orderHistory = async(req,res)=>{
    const history = await user1Schema.find()
    if (!history) {
        res.send({status:401, message:"history_not_found"})
    } else {
       res.send({status:200, sucess:true,result:history}) 
    }
}
// ================ PAYMENT gateway Razorpay START ===========================

// Create a route for initiating a payment
// const razorpay_create_payment = async (req, res) => {
//     try {
//         const { amount ,userId} = req.body;    
//         const options = {
//           amount: amount * 100, // Amount in paise (1 INR = 100 paise)
//           currency: 'INR',
//         //   receipt: orderId,
//           payment_capture: 1, // Auto-capture payment
//         };    
//         razorpay.orders.create(options, (err, orders) => {
//           if (err) {
//             console.log(err);
//             return res.status(500).send({ error: 'Error creating Razorpay order' });
//           }    
//           // Save the order ID to your database (optional)
//       // Create a Payment document in MongoDB
//       const payment = new paymentModel({
//         orderId: orders._id,  
//         amount: amount,
//       });
//       console.log(">>>>>ppppppppppp",payment);
//     const paymenOrder = payment.save();
//           res.send({status:200, message:"payment sucess",result:paymenOrder});
//         });
//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: 'An error occurred' });
//       }    
// };

// ============================= razor_pay ===========================================
const razorpay = new Razorpay({
    key_id: 'rzp_test_AOjY52pvdqhUEh',
    key_secret: 'tB1CHTW3BvEb9TR06ILUCBWV',
});
// ============================razor_pay end===========================================
// const razorpay_create_payment = async(req,res)=>{
//     try {
//         const { amount, userId,partnerId, description } = req.body;    
//         // Create a Razorpay order
//         const options = {
//           amount: amount * 100, // Amount in paise (1 INR = 100 paise)
//           currency: "INR",
//           payment_capture: 1, // Auto-capture payment
//         };
    
//         const order = await razorpay.orders.create(options);
//         // Generate a new ObjectId
//         const validObjectId = new mongoose.Types.ObjectId(); 
//         const validPartnerId = new mongoose.Types.ObjectId({partnerId});   
//         // Create a Payment document in MongoDB
//         const payment = new paymentModel({
//           orderId: validObjectId,
//           userId: userId,
//           partnerId:validPartnerId,
//           paymentId: order.id,
//           amount: amount,
//           description: description,
//         });
    
//         // Save the Payment document and await the Promise
//         const savedPayment = await payment.save();
    
//         res.status(200).json({
//           message: "Payment success",
//           payment: savedPayment,
//           razorpayOrder: order,
//         });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "An error occurred" });
//       }
// }
const razorpay_create_payment = async (req, res) => {
    try {
      const { amount, userId, partnerId, description } = req.body;
      // Create a Razorpay order
      const options = {
        amount: amount * 100, // Amount in paise (1 INR = 100 paise)
        currency: "INR",
        payment_capture: 1, // Auto-capture payment
      };
  
      const order = await razorpay.orders.create(options);
      // Create a Payment document in MongoDB
      const payment = new paymentModel({
        orderId:new mongoose.Types.ObjectId(), // Generate a new ObjectId
        userId: userId,
        partnerId: partnerId, // Use the partnerId string directly
        paymentId: order.id,
        amount: amount,
        description: description,
      });
  
      // Save the Payment document and await the Promise
      const savedPayment = await payment.save();
  
      res.status(200).json({
        message: "Payment success",
        payment: savedPayment,
        razorpayOrder: order,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  };
  
// =============================================
const payment_callback = async (req, res) => {
    try {
      const { paymentId } = req.body;
  
      // Find the payment using razorpay_order_id
      const payment = await paymentModel.findOne({ paymentId });
    //   console.log(">>>>>>>>>",payment);
  
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }  
      // Update the payment status to "confirmed"
      payment.status = 'confirmed';
      await payment.save();
  
      res.status(200).json({ message: 'payment_confirmed' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
    
// ================ PAYMENT gateway Razorpay END ==============================


// ==================== Start Add_Money api ===================================
// const add_Money = async(req,res)=>{
//     try {
//         const { userId, amount } = req.body;    
//         // Validate the userId and amount
//         if (!userId || !amount) {
//           return res.status(400).json({ success: false, msg: 'Invalid userId or amount' });
//         }    
//         // Find the user by their userId
//         const user = await newuserSchema.findOne({ _id: userId });    
//         if (!user) {
//           return res.status(404).json({ success: false, msg: 'User not found' });
//         }    
//         // Perform the "addMoney" operation by updating the user's wallet
//         const parsedAmount = parseFloat(amount);
//         if (isNaN(parsedAmount)) {
//           return res.status(400).json({ success: false, msg: 'Invalid amount format' });
//         }    
//         // Update the wallet document associated with the user
//         const wallet = await wallet_amount.findOne({ userId: userId });    
//         if (!wallet) {
//           // If the wallet document doesn't exist, create one
//           const newWallet = new wallet_amount({
//             userId: userId,
//             addAmount: parsedAmount,
//           });
//           await newWallet.save();
//         } else {
//           // If the wallet document exists, update the addAmount
//           wallet.wallet_amount += parsedAmount;
//           await wallet.save();
//         }    
//         return res.status(200).json({ success: true, msg: 'Money added successfully', user_walletAmount: wallet.wallet_amount });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, msg: 'An error occurred' });
//       }
// }

const add_Money = async (req, res) => {
    try {
      const { userId, amount } = req.body;
  
      // Validate the userId and amount
      if (!userId || !amount) {
        return res.status(400).json({ success: false, msg: 'Invalid userId or amount' });
      }
  
      // Find the user by their userId
      const user = await newuserSchema.findOne({ _id: userId });
  
      if (!user) {
        return res.status(404).json({ success: false, msg: 'User not found' });
      }
  
      // Perform the "addMoney" operation by updating the user's wallet
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) {
        return res.status(400).json({ success: false, msg: 'Invalid amount format' });
      }  
      const newWallet = new wallet_amount({
             userId: userId,
             addAmount: parsedAmount,
             });
             await newWallet.save();
      // Update the user's wallet amount
      user.wallet_amount += parsedAmount;
      await user.save();
  
      return res.status(200).json({ success: true, msg: 'Money added successfully', user_walletAmount: user.wallet_amount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: 'An error occurred' });
    }
  };
// ================== Notification BAR api ====================================
  const notification = async(req,res)=>{
    try {
        const { userId, message } = req.body;

        const notification = new Notification({
             userId,
             message 
            });
        await notification.save();
        res.status(201).json({ success: true, notification });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
      }
  }
  const getNotification = async(req,res)=>{
    try {
        const userId = req.params.userId;
        const notifications = await Notification.findOne({ userId })  
        // console.log(notifications); 
              if(notifications){
                  res.status(200).json({ success: true, notifications });
              }
              else{
                res.status(400).json({ success: false, message:"user_not_found" });
              }
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
      }
  }
// ================== if user login he change this password doing ==========================
const { check, validationResult } = require('express-validator');
const loginUserchangePassword = async(req,res)=>{
    try {
        const userId = req.params.userId;
        const { currentPassword, newPassword } = req.body;    
        // Validate the input and ensure the user is authenticated
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ success: false, errors: errors.array() });
        }    
        // Find the user by their userId
        const user = await newuserSchema.findOne({ _id: userId });    
        if (!user) {
          return res.status(404).json({ success: false, msg: 'User not found' });
        }    
        // Check the current password
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);  
        if (!isPasswordMatch) {
          return res.status(401).json({ success: false, msg: 'Current password is incorrect' });
        }    
        // Hash and update the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
       const result = await user.save();
    
        res.status(200).json({ success: true, msg: 'Password changed successfully' ,result:result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'An error occurred' });
      }
}


module.exports = {
    createuser,
    verifyotp,
    login,
    user_login,
    resendOTP,
    getProduct,
    profile,
    user1,
    orderHistory,
    reset_password_request,
    reset_password_set,
    razorpay_create_payment,
    payment_callback,
    add_Money,
    notification,
    getNotification,
    loginUserchangePassword
}



// ============ for_partnerID======================================================

// const helper = require("../../config/helper");
// const Users = require("../models/user");
// const { catchBlock } = require("../../config/helper");
// const UserDao = require('../dao/userDao')

// module.exports = {
//   register: async (req, res) => {
//     try {
//       console.log("Received registration request:", req.body);
//       let createUserObj = {};
//       createUserObj.name = req.body.name;
  
//       if (!req.body.email) {
//         console.log("Error: Invalid email");
//         return catchBlock("Invalid email", res, 0, {}, req.headers["requestby"]);
//       }
//       createUserObj.email = req.body.email.trim().toLowerCase();
  
//       if (!req.body.mobileNo || isNaN(req.body.mobileNo)) {
//         console.log("Error: Mobile Number not valid");
//         return catchBlock("Mobile Number not valid", res, 0, {}, req.headers["requestby"]);
//       }
  
//       let mobile = String(req.body.mobileNo);
//       if (mobile.charAt(0) === "0") mobile = mobile.substring(1);
  
//       createUserObj.mobileNo = mobile;
  
//       if (req.body.password !== req.body.confirm_password) {
//         console.log("Error: Password not Match");
//         return catchBlock("Password not Match", res, 0, {}, req.headers["requestby"]);
//       }
      
//       createUserObj.password = await helper.encryptPassword(req.body.password);
      
//       const existingUser = await Users.findOne({ memberId: req.body.sponserId });
//       if (!existingUser) {
//         console.log("Error: Sponser Id not found");
//         return catchBlock("Sponser Id not found", res, 0, {}, req.headers["requestby"]);
//       }
      
//       createUserObj.sponserId = req.body.sponserId;
//       createUserObj.position = req.body.position;
//       createUserObj.nominee_name = req.body.nominee_name;
//       createUserObj.nominee_relation = req.body.nominee_relation;
//       createUserObj.DOB = req.body.DOB;
//       createUserObj.tpin=helper.generateTpin();
  
//       const existingUserMobileCount = await Users.countDocuments({ mobileNo:req.body.mobileNo });
//       const existingUserEmailCount = await Users.countDocuments({ email:req.body.email });
  
//       if (existingUserMobileCount < 3 || existingUserEmailCount < 3) {
            
//       } else {
//         console.log("Error: Maximum user limit reached for this mobile number");
//         return catchBlock("Maximum user limit reached for this mobile number", res, 0, {}, req.headers['requestby']);
//       }
  
//       await UserDao.createUser(createUserObj)
//       console.log("User successfully Registered:", createUserObj);
      
//       return catchBlock("User successfully Registered", res, 1, {}, req.headers['requestby']);
//     } catch (error) {
//       console.error("Error during registration:", error);
//       return catchBlock("Some error in Register", res, 0, {}, req.headers['requestby']);
//     }
 // },
//   ========================================


// ============== payment Confirm ============================
 // try {
    //     const { paymentId, orderId } = req.body;    
    //     // Verify the payment
    //     razorpay.payments.fetch(paymentId, async (err, payment) => {
    //       if (err || payment.order_id !== orderId) {
    //         return res.status(400).json({ error: 'Payment verification failed' });
    //       }    
    //       // Update the payment status in your database
    //       const updatedPayment = await paymentModel.findOne({ orderId });
    //       updatedPayment.status = payment.status;
    //       await updatedPayment.save();
    
    //       res.json({ status: 'Payment success' });
    //     });
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: 'An error occurred' });
    //   }
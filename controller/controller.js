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
const order_ProductModel = require("../model/user1"); // orders
const Product = require("../model/admin/addProduct");
const Razorpay = require('razorpay');
const Token = require('../model/model');
const wallet_amount = require("../model/addMoney");
const Notification = require("../model/notificationBar");
const jwt = require('jsonwebtoken');
const serviceOrder = require('../model/serviceOrder');
const findEstampService = require('../model/admin/service');
const orderService = require("../model/admin/service");

// ============================= start Signup start ====================================
// const createuser = async (req, res) => {
//     try {
//         const { name, phone, email, password } = req.body;
//         if (!email) {
//             res.status(400).send({ success: false, msg: "Email is required" });
//             return;
//         }
//         if (!password) {
//             res.status(400).send({ success: false, msg: "Password is required" });
//             return;
//         }
//         // Generate a unique partner ID (you can use a library like `uuid` for this)
//         const partnerId = helper.generatePartnerId();
//         // Check if the email already exists in the database
//         const userData = await newuserSchema.findOne({ email: email } && { phone: phone });
//         if (userData) {
//             res.status(201).send({ success: false, msg: "Email or phone already exists" });
//         } else {
//             const hashedPassword = bcrypt.hashSync(password, 10);
//             const newUser = new newuserSchema({
//                 name,
//                 phone,
//                 email,
//                 partnerId, // Set the partnerId
//                 password: hashedPassword
//             });
//             // Save the new user to the database
//             const user_data = await newUser.save();

//             // Send an email with the partnerId
//             const transporter = nodemailer.createTransport({
//                 host: 'weberse.in',
//                 port: 465,
//                 secure: true,
//                 auth: {
//                   user: 'info@weberse.live',
//                   pass:'Pp@7884294',
//                   authMethod: 'PLAIN', // Specify the authentication method ('LOGIN' or 'PLAIN' for most email providers)
//                 },
//               });
//             const mailOptions = {
//                 from:'info@weberse.live',
//                 to: email,
//                 subject: partnerId,
//                 text: `Your Partner ID is: ${partnerId}`,
//             };
//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.error(error);
//                     res.status(400).send({ success: false, msg: "Email sending failed" });
//                 } else {
//                     console.log("Email sent:", info.response);
//                     res.status(200).send({ success: true, data: user_data });
//                 }
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({ status: 400, message: error.message });
//     }
// }
// ==============================start create user email verify  =======================
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
         // Hash the partnerId
    // const hashedPartnerId = bcrypt.hashSync(partnerId, 10);
        // Check if the email already exists in the database
        const userData = await newuserSchema.findOne({ email: email } && { phone: phone });
        if (userData) {
            res.status(201).send({ success: false, msg: "Email or phone already exists" });
            return;
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new newuserSchema({
            name,
            phone,
            email,
            partnerId,
            // :hashedPartnerId, // Set the partnerId
            password: hashedPassword
        });
        // Save the new user to the database
        const user_data = await newUser.save();

        // Create a verification token (you can use a library like `jsonwebtoken` to create tokens)
        const verificationToken = jwt.sign({ email },process.env.SECRET_KEY, { expiresIn: '1h' });
        // Construct the verification link
        const verificationLink = `https://infoweberse.live/verify?token=${verificationToken}`;

        // Send an email with the partnerId and verification link
        const transporter = nodemailer.createTransport({
            host: 'weberse.in',
            port: 465,
            secure: true,
            auth: {
                user: 'info@weberse.live',
                pass: 'Pp@7884294',
                authMethod: 'PLAIN',
            },
        });
        const mailOptions = {
            from: 'info@weberse.live',
            to: email,
            subject: partnerId,
            text: `Your Partner ID is: ${partnerId}\nVerify your email by clicking this link: ${verificationLink}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(400).send({ success: false, msg: "Email sending failed" });
            } else {
                console.log("Email sent:", info.response);
                res.status(200).send({ success: true, data: user_data, verificationLink });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: error.message });
    }
};

// ============================= END ===================================================

// ============================= end Signup ===========================================

// {
//     "name":"vp",
//     "phone":9559602440,
//     "email":"vv@gmail.com",
//     "password":"12344321"
//   }

// ============================= login user start ===========================================
const login = async (req, res) => {   // otp send on number
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

// ============================= login end ===========================================
// =========================== api user_login ========================================

const user_login = async (req, res) => {
  try {
      const { partnerId, password } = req.body;

      if (!partnerId || !password) {
          return res.status(400).json({ success: false, message: "Both partnerId and password are required" });
      }

      // Find the user in the database by partnerId
      const user = await newuserSchema.findOne({ partnerId });

      if (!user) {
          return res.status(401).json({ success: false, message: "User not found" });
      }

      // Compare the provided partnerId with the partnerId from the database
      // const partnerIdMatch = partnerId === user.partnerId;

      // if (!partnerIdMatch) {
      //     return res.status(401).json({ success: false, message: "Incorrect partnerId" });
      // }

      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ success: false, message: "Incorrect password" });
      }

      const { _id, phoneNo } = user;
      const token = helper.createJwtToken({ _id, phoneNo });
      user.token = token;

      // You should save the user after adding the token
      await user.save();
      res.status(200).json({ success: true, message: "Login successful", result: user });
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

        // const { _id, phoneNo } = user
        // const token = helper.createJwtToken({ _id, phoneNo });
        // res.send({ message: "Otp verify successfully", token: token });
        res.send({ message: "Otp verify successfully" });
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

//   ============== order history ========================================
const orderHistory = async(req,res)=>{
    const history = await user1Schema.find()
    if (!history) {
        res.send({status:401, message:"history_not_found"})
    } else {
       res.send({status:200, sucess:true,result:history}) 
    }
}
// ================ PAYMENT gateway Razorpay START =========================

// Create a route for initiating a payment
// ============================= razor_pay for product start=================================
const razorpay = new Razorpay({
    key_id: 'rzp_test_AOjY52pvdqhUEh',
    key_secret: 'tB1CHTW3BvEb9TR06ILUCBWV',
});

const fetchProductPrice = async (productId) => {
  try {
    // Replace this with your actual database query to retrieve the product price
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      // Handle the case where the product is not found
      throw new Error('Product not found');
    }
    // Return the price of the product
    return product.productPrice;
  } catch (error) {
    console.error('Error fetching product price:', error);
    // Handle errors and return a default price or an error message as needed
    throw new Error('Error fetching product price');
  }
};

const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, // Amount in paise (1 INR = 100 paise)
    currency: 'INR',
    receipt: 'order_rcptid_11',
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order.id; // Return the order ID
  } catch (error) {
    throw error;
  }
};

const razorpay_create_order_and_payment = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;

    if (!products || products.length === 0 || totalPrice === undefined) {
      return res.status(400).json({ success: false, message: 'Products and totalPrice are required' });
    }
    
    const productArray = [];
    for (const product of products) {
      if (!product.productId) {
        return res.status(400).json({ success: false, message: 'Each product must have a productId' });
      }
      // Replace this with your logic to fetch product price from the database
      const productPrice = await fetchProductPrice(product.productId);
      const totalPrice = productPrice; // Calculate the total price based on the product price
      productArray.push({
        productId: product.productId,
        totalPrice: totalPrice,
      });
    }

    // Create a Razorpay order and get the order ID
    const razorpayOrder = await createRazorpayOrder(totalPrice);

    console.log(razorpayOrder);

    const order = new order_ProductModel({
      products: productArray,
      totalAmount: totalPrice, // Save the totalAmount
      orderId: razorpayOrder, // Save the Razorpay order ID
    });

    const newOrder = await order.save();
    res.status(201).json({ success: true, razorpayOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};
 
  // ======================= confirm product payment ============================
  const payment_callback = async (req, res) => {
      try {
        const { paymentId,orderId } = req.body;  
        // Find the payment using razorpay_order_id
        const payment = await paymentModel.findOne({ paymentId });
      //   console.log(">>>>>>>>>",payment);
    
        if (!payment) {
          return res.status(404).json({ error: 'Payment not found' });
        }  
        // Update the payment status to "confirmed"
        payment.status = 'confirmed';
        await payment.save();
        const order = await order_ProductModel.findOne({orderId});
        if (!order) {
          return res.status(404).json({ error: 'order not found' });
        } 
       order.status = 'sucess';
       await order.save();
  
        res.status(200).json({ message: 'payment_confirmed and order sucess' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    };
// ============================ razor_pay for product end =======================

// ===================== raszor pay for Service start ===========================
// Helper function to create a Razorpay order
const create_RazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, // Amount in paise (1 INR = 100 paise)
    currency: 'INR',
    receipt: 'order_rcptid_' + Date.now(),
    payment_capture: 1,
  };
  try {
    return await razorpay.orders.create(options);
  } catch (error) {
    throw error;
  }
}

const createOrderAPI = async (req, res) => {
  try {
    const serviceId = req.params._id;
    const { activationPrice, validity } = req.body;

    const service_find_hit_limit = await orderService.findById({_id:serviceId});
    //  const perHitCharge = service_find_hit_limit.type.perHitCharge ;
     const limit_hit = service_find_hit_limit.type.hit_limit ;
    // Create a Razorpay order
    const razorpayOrder = await create_RazorpayOrder(activationPrice, serviceId);
    // Save the order details in the database
    const newOrder = new serviceOrder({
      serviceId,
      activationPrice,
      validity,
      // perHitCharge:req.body,
      limit_hit,
      orderId: razorpayOrder.id,
    });
    await newOrder.save();

    res.status(201).json({ success: true, result: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
};

// =============  perHitCharge ================================================
const create_Razorpay_Order = async (amount) => {
  const options = {
    amount: amount * 100, // Amount in paise (1 INR = 100 paise)
    currency: 'INR',
    receipt: 'order_rcptid_' + Date.now(),
    payment_capture: 1,
  };
  try {
    return await razorpay.orders.create(options);
  } catch (error) {
    throw error;
  }
}

const perHitC_createOrderAPI = async (req, res) => {
  try {
    const serviceId = req.params._id;
    const { validity } = req.body;

    // Fetch the service details, including "perHitCharge"
    const service = await orderService.findById(serviceId);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const perHitCharge = service.type.perHitCharge;

    // Calculate the amount based on the "perHitCharge"
    const amount = perHitCharge;

    // Create a Razorpay order
    const razorpayOrder = await create_Razorpay_Order(amount);

    // Save the order details in the database
    const newOrder = new serviceOrder({
      serviceId,
      perHitCharge,
      validity,
      orderId: razorpayOrder.id,
    });

    await newOrder.save();

    res.status(201).json({ success: true, result: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
};



// ===================== raszor pay for Service end =============================

//   =============== Validity date expiration ===================================
const checkValidityExpiration = async(req,res)=>{
    try {
        // Calculate the date 30 or 31 days ago
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() - 30); // Change to 31 for 31 days
    
        // Find service orders with 'success' status and a created date older than the expiration date
        const expiredOrders = await serviceOrder.find({
          status: 'sucess',
          created: { $lt: expirationDate },
        });
    
        res.status(200).json({
          message: 'Expired service orders found',
          expiredOrders: expiredOrders,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
}
  

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
// ============== if user login he change this password doing =================
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

// ===========generatye apiKey ==================================================
const generate_api_key =async(req,res)=>{
  try {
    const { partnerId, phone } = req.body;
    // Check if a user with the provided partnerId and phone exists in your database
    const user = await newuserSchema.findOne({ partnerId, phone });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    // Generate the API key
       const api_Key = helper.createJwtToken({partnerId, phone});
    // Store the generated API key in the user's document
    user.apiKey = api_Key;
    await user.save();
    res.status(200).json({ success: true, api_Key });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error generating or storing the API key' });
  }
}
// ========= identify user by apikey  ===========================================
const identifyApiKey = async (req, res) => {
  try {
    if(!req.user) return res.status(401).json({ error: 'User not authenticated.' });
    console.log(req.user)
    const { partnerId } = req.user;
    if (!partnerId) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const user = await newuserSchema.findOne({ partnerId });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json({ success: true, user:user._id });
  } catch (error) {
    // console.error('Error:', error);
    res.status(500).json({ error: 'Error identifying the user by apiKey' });
  }
}

// ========== Edit_User_profile_addImage ========================================
const Edit_User_profile_addImage = async (req, res) => {
  try {
    const id = req.params.id;
    const  profileImage  = req.file.path;
    console.log(req.file)

    // Update the user's profileImage using findByIdAndUpdate
    const user = await newuserSchema.findByIdAndUpdate(
      id,
      { profileImage:profileImage },
      { new: true }
    );

    if (!user) {
      res.status(404).send({ message: "user_not_found" });
    } else {
      res.send({ success: true, result: user });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ status: 400, message: error.message });
  }
};

const getServices = async(req,res)=>{
  try {
    const findServices = await addService.find();  
    // console.log(findProduct, ">>>>>>>>>>...");
    if (!findServices) {
        res.send({ sucess: false, message: "productList_not_found" });
    }
    res.send({ sucess: true, result: findServices })
} catch (error) {
    console.log(error)
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
    orderHistory,
    reset_password_request,
    reset_password_set,
    razorpay_create_order_and_payment, // razorpay_create_order_and_payment
    createOrderAPI,   // monthaly
    perHitC_createOrderAPI,    // perHit_charge
    payment_callback,
    checkValidityExpiration,
    add_Money,
    notification,
    getNotification,
    loginUserchangePassword,
    generate_api_key,
    identifyApiKey,
    Edit_User_profile_addImage,
    getServices,
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
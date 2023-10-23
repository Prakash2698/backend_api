const newuserSchema = require("../model/model");
const bcrypt = require("bcrypt"); // Import the bcrypt library
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const common = require("../config/common");
const helper = require("../helper/helper");
const OtpSchema = require("../model/otp");
const productList = require("../model/admin/addProduct");
const kycSchema = require("../model/kyc");
const user1Schema = require("../model/user1");
const Product = require("../model/admin/addProduct");
const Razorpay = require('razorpay');
// ============================= razor_pay ===========================================
const razorpay = new Razorpay({
    key_id: 'YOUR_API_KEY',
    key_secret: 'YOUR_API_SECRET',
});
// ============================razor_pay end============================================

// ============================= start Signup start ====================================
// const createuser = async (req, res) => {
//     try {
//         const { name, phone, email, password } = req.body; // Destructure the request body

//          // Generate a unique partner ID (you can use a library like `uuid` for this)
//            const partnerId = helper.generatePartnerId();
           
         


//         if (!email) {
//             res.status(400).send({ success: false, msg: "Email is required" });
//             return;
//         }
//         if (!password) {
//             res.status(400).send({ success: false, msg: "Password is required" });
//             return;
//         }
//         // Check if the email already exists in the database using the check.findUser function
//         const userData = await newuserSchema.findOne({ email: email } && { phone: phone });

//         if (userData) {
//             res.status(201).send({ success: false, msg: "Email or phone already exists" });
//         } else {
//             // Hash the password before saving it in the database
//             const hashedPassword = bcrypt.hashSync(password, 10);
//             // Create a new user instance using the Mongoose model
//             const newUser = new newuserSchema({
//                 name,
//                 phone,
//                 email,
//                 partnerId,
//                 password: hashedPassword // Set the hashed password
//             });
//               // Send the email and wait for it to complete
//               const sendEmail = await transporter.sendMail({email:email});
//               if(sendEmail){
//                  res.status(400).send({ success: false, msg: "Email sent successfully" });
//               }
//             // console.log(">>>>>>>>>>>>>>>>>>...",newUser);
//             // Save the new user to the database
//             const user_data = await newUser.save();
//             console.log(user_data, "user saved in the database");
//             res.status(200).send({ success: true, data: user_data });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({ status: 400, message: error.message });
//     }
// }

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
// =========================== I am doing this user_login ========================================
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
// const profile = async (req, res) => {
//     try {
//         const userId = req.params._id;
//         // console.log(userId,">>>>>>>>>>>>>>>>>>>>.");
//         // Use the `populate` method to fetch books with author details
//         const userProfile = await newuserSchema.find({ _id: userId }).populate('kyc');
//         console.log(userProfile,">>>>>>>>>>>>>>>....");
//         if(!userProfile){
//             res.send({sucess:false,message:"profile_not_found"})
//         }
//         res.send({status:200 ,sucess:true ,result : userProfile});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// }

// =============================================================================


// const profile = async (req, res) => {
//     try {
//       const userId = req.params.userId; // Assuming you pass the user's _id as a parameter

//       const userProfile = await newuserSchema.aggregate([
//         {
//           $match: {
//             _id:new mongoose.Types.ObjectId(userId),
//           },
//         },
//         {
//           $lookup: {
//             from: "kyc", // Name of the KYC collection
//             localField: "_id", // Field in the User collection
//             foreignField: "userId", // Field in the KYC collection
//             as: "kycData",
//           },
//         },
//       ]);
//   console.log(">>>>>>>>>>>>>",userProfile);
//       if (userProfile.length > 0) {
//         // userProfile[0] contains the user's profile data
//         res.status(200).json({ success: true, data: userProfile[0] });
//       } else {
//         res.status(404).json({ success: false, message: "User profile not found" });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, message: "An error occurred" });
//     }
//   };

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
// =================================================
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
 
const orderHistory = async(req,res)=>{
    const history = await user1Schema.find()
    if (!history) {
        res.send({status:401, message:"history_not_found"})
    } else {
       res.send({status:200, sucess:true,result:history}) 
    }
}

// Create a route for initiating a payment
const create_payment = async (req, res) => {
    const { amount } = req.body;

    const payment_capture = 1;
    const currency = 'INR';

    const options = {
        amount: amount * 100, // Razorpay expects the amount in paise
        currency,
        receipt: 'receipt#1',
        payment_capture,
    };
    try {
        const order = await razorpay.orders.create(options);
        const newPayment = new Payment({
            amount,
            status: 'pending',
        });
        await newPayment.save();
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send('Payment creation failed');
    }
};




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
    create_payment,
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
const newuserSchema = require("../model/model");
const bcrypt = require("bcrypt"); // Import the bcrypt library

const common = require("../config/common");
const helper = require("../helper/helper");
const OtpSchema = require("../model/otp");
const productList = require("../model/admin/addProduct")

const createuser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body; // Destructure the request body

        if (!email) {
            res.status(400).send({ success: false, msg: "Email is required" });
            return;
        }
        if (!password) {
            res.status(400).send({ success: false, msg: "Password is required" });
            return;
        }
        // Check if the email already exists in the database using the check.findUser function
        const userData = await newuserSchema.findOne({ email: email } && { phone: phone });

        if (userData) {
            res.status(201).send({ success: false, msg: "Email or phone already exists" });
        } else {
            // Hash the password before saving it in the database
            const hashedPassword = bcrypt.hashSync(password, 10);
            // Create a new user instance using the Mongoose model
            const newUser = new newuserSchema({
                name,
                phone,
                email,
                password: hashedPassword // Set the hashed password
            });
            // console.log(">>>>>>>>>>>>>>>>>>...",newUser);
            // Save the new user to the database
            const user_data = await newUser.save();
            console.log(user_data, "user saved in the database");
            res.status(200).send({ success: true, data: user_data });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: error.message });
    }
}

// {
//     "name":"vp",
//     "phone":9559602440,
//     "email":"vv@gmail.com",
//     "password":"12344321"
//   }


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



module.exports = {
    createuser,
    verifyotp,
    login,
    resendOTP,
    getProduct
}
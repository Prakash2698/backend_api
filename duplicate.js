const UserDao = require('../dao/userDao')
const { catchBlock } = require('../config/helper')
const helper = require('../config/helper')
module.exports = {
  register: async (req, res) => {
    try {
        const { username, email, mobileNo } = req.body;

        if (!email) return catchBlock("Enter a valid email address", res, 0, {}, req.headers['requestby']);

        if (!mobileNo || isNaN(mobileNo)) return catchBlock("Enter a valid mobile number", res, 0, {}, req.headers['requestby']);

        const cleanedEmail = email.trim().toLowerCase();
        const cleanedMobileNo = mobileNo.toString().replace(/\s+/g, '').trim();

        const formattedMobileNo = cleanedMobileNo.charAt(0) === '0' ? cleanedMobileNo.substring(1) : cleanedMobileNo;

        if (isNaN(formattedMobileNo)) return catchBlock("Enter a valid mobile number", res, 0, {}, req.headers['requestby']);

        const existingUser = await UserDao.findUser({ $or: [{ email: cleanedEmail }, { mobileNo: formattedMobileNo }, { username: username }] });

        if (existingUser) return catchBlock("Mobile number or email already in use", res, 0, {}, req.headers['requestby']);

        const otp = helper.otpGenerate();

        // Send OTP to the mobile number using MSG91
        const otpSent = await helper.generateOtpWithMSG91({ mobileNo: formattedMobileNo, otp });

        if (otpSent === true) {
            // If OTP was successfully sent, store the user in the database
            const createUserObj = { username, email: cleanedEmail, mobileNo: formattedMobileNo };
            await UserDao.createUser(createUserObj);
            await UserDao.createOtp({ otp,mobileNo:formattedMobileNo }); // Pass OTP as an object
            return catchBlock("User successfully registered", res, 1, {}, req.headers['requestby']);
        } else {
            return catchBlock("Failed to send OTP to the mobile number", res, 0, {}, req.headers['requestby']);
        }

    } catch (error) {
        console.error("Error in Register:", error);
        return catchBlock("Some error in Register", res, 0, {}, req.headers['requestby']);
    }
},

      
	isOtpVerify: async (req, res) => {
		try {
			const isVerifyOtp = await UserDao.isVerifyOtp({ mobile: req.body.params, isVerify: false, otp: Number(req.body.otp) })
			if (!isVerifyOtp) return catchBlock("Invalid Otp", res, 0, {}, req.headers['requestby'])

			await UserDao.updateVerifyOtp({ _id: isVerifyOtp._id }, { $set: { isVerify: true } })
			const user = await UserDao.findUser({ mobileNo: req.body.mobile })
			if (!user) return catchBlock("User not found", res, 0, {}, req.headers['requestby']);

			const { _id, mobileNo } = user
			const token = helper.createJwtToken({ _id, mobileNo })

			return catchBlock("Otp verify successfully", res, 1, { token, user }, req.headers['requestby'], 1)

		} catch (error) {
			return catchBlock("Some error in OTP verify", res, 0, {}, req.headers['requestby']);
		}
	},
	login: async (req, res) => {
		try {
			const mobileNo = await UserDao.findUser({ mobileNo: req.body.mobileNo })
      console.log(mobileNo)
			if (!mobileNo) return catchBlock("mobile not found", res, 0, {}, req.headers['requestby']);
      const otp = helper.otpGenerate();
      const otpSent = await helper.generateOtpWithMSG91({ mobileNo: mobileNo.mobileNo, otp });
      console.log(otpSent)
      if (otpSent === true) {    
        await UserDao.createOtp({ otp,mobileNo:mobileNo }); // Pass OTP as an object
        return catchBlock("Otp successfully send", res, 1, {}, req.headers['requestby']);
    } else {
        return catchBlock("Failed to send OTP to the mobile number", res, 0, {}, req.headers['requestby']);
    }
		} catch (error) {
			console.log(error.message)
			return catchBlock("Some error in OTP verify", res, 0, {}, req.headers['requestby']);
		}
	},

  resendOTP: async(req,res)=>{
    try {
      const userId = req.params.userId;
      const user = await UserDao.findUserById(userId);
      console.log(user)

			if (!user) return catchBlock("mobile not found", res, 0, {}, req.headers['requestby']);
      const otp = helper.otpGenerate();
      const otpSent = await helper.generateOtpWithMSG91({ mobileNo: user.mobileNo, otp });
      console.log(otpSent)
      if (otpSent === true) {     
        await UserDao.createOtp({ otp,mobileNo:user.mobileNo }); // Pass OTP as an object
        return catchBlock("Otp successfully send", res, 1, {}, req.headers['requestby']);
    } else {
        return catchBlock("Failed to send OTP to the mobile number", res, 0, {}, req.headers['requestby']);
    }

  } catch (error) {
      console.error('Error in accessing user data:', error);
      return res.status(500).json({ success: false, message: 'Some error in accessing user data' });
  }

  }
	
}


// ====================================
// const newuserSchema = require("../model/model")
// const check = require("../common/common");
// // const createuser = async (req, res) => {
// //     try {
// //         const User = new newuserSchema({
// //             name: req.body.name,
// //             phone: req.body.phone,
// //             email: req.body.email,
// //             password: req.body.password
// //         });
// //         console.log(User,"=======");
// //         console.log(email,">>>>>>>>>>>>>>>>>>>>>");
// //         const userData = await newuserSchema.findOne({ email: req.body.email });
// //         if(userData){
// //           res.status(201).send({success:false,msg:"This email already exit"});
// //         }else{
// //           const user_data = await User.save();
// //           res.status(200).send({success:true,data:user_data});
// //         }
// //     } catch (error) {
// //         console.log(error);
// //         res.send({status:400,message:error})
// //     }
// // }

// const createuser = async (req, res) => {
//     try {
//         const { name, phone, email, password } = req.body; // Destructure the request body

//         if (!email) {
//             res.status(400).send({ success: false, msg: "Email is required" });
//             return;
//         }

//         const User = {
//             name,
//             phone,
//             email,
//             password
//         };

//         const userData = await check.findUser({User});

//         if (userData) {
//             res.status(200).send({ success: false, msg: "This email already exists" });
//         } else {
//             const user_data = await User.save();
//             res.status(200).send({ success: true, data: user_data });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({ status: 400, message: error });
//     }
// }


//     module.exports = {
//         createuser
//     }
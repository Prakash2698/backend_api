const otp = require("../model/otp");

module.exports = {
    // catchBlock: (
    //     msg,
    //     res,
    //     code = 0,
    //     err = null,
    //     requestfrom = "mobile",
    //     userLogin = 0
    //   ) => {
    //     return res.json({
    //       data: {
    //         code: code,
    //         message: msg,
    //         userLogin: userLogin,
    //         result: err == null ? {} : err,
    //       },
    //     });
    //   },
    otpGenerate:()=>{
        return Math.floor(Math.random() * 1000000);
    },
    generateOtp: async (otpData) => {
        return await otp(otpData).save();
      },
      // createUser: async (UserData) => {
      //   console.log(UserData)
      //   return await User(UserData).save();
      // },
      createOtp: async (otpData) => {
        return await otp(otpData).save();
      },
      updateVerifyOtp: async (id, otpData) => {
        return otp.findOneAndUpdate(id, otpData);
      },
}
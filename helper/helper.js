const userSchema = require("../model/model");
require('dotenv').config();
const axios=require('axios');
const jwt = require("jsonwebtoken");
let serialNumber = 0;
// let serialNumber = 0;
const { v4: uuidv4 } = require('uuid');

module.exports = {    
    // =============== check for email and phone ===================
    findUser : async (userData) => {
        return await userSchema.findOne({
          $or: [
            // { _id: userData.user_id },
            { email: { $regex: `^${userData.email}$`, $options: "i" } },
            { phone: userData.phone },
          ],
        });
      },

      // ========================= MSG91 ==========================
      generateOtpWithMSG91: async (otpObj) => {
        var phone = '91' + otpObj.phone; 
        console.log(otpObj)
        const options = {
            method: 'GET',
            url: `https://control.msg91.com/api/v5/otp?template_id=${process.env.TEMPLATE_ID}&mobile=${phone}&otp=${otpObj.otp}&otp_length=6&otp_expiry=2`,
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authkey: process.env.AUTH_KEY,
            },
            data: { Param1: 'value1', Param2: 'value2', Param3: 'value3' }
        };    
        try {
            const response = await axios.request(options);
            if (response.data.type === 'success') {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            return false;
        }
    },
   
  createJwtToken: (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  },

  otpGenerate:()=>{
       return Math.floor(Math.random() * 1000000);
   },
   createJwtToken: (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  },

  
  // generatePartnerId:()=>{
  //   serialNumber++;
  //   return `DEP000${serialNumber}`;
  // },
//   generatePartnerId: () => {
//     // Generate a UUID as the partner ID
//     return `DEP${uuidv4()}`;
// }
generatePartnerId: () => {
  serialNumber++;
  const paddedSerialNumber = serialNumber.toString().padStart(6, '0'); // Ensure the serial number is 6 digits long with leading zeros
  return `DEP${paddedSerialNumber}`;
},

calculateTotalPrice(service, validity) {
  if (service && service.price) {
    const price = service.price;      
    switch (validity) {
      case '7days':
        return price;
      case 'monthly':
        return price * 4; // Assuming a month is considered as 4 weeks
      case 'yearly':
        return price * 52; // Assuming a year is considered as 52 weeks
      // Add more cases for other validity options
      default:
        return price;
    }
  }  
  return 0; // Return a default value if service or price is missing
}

}

var express = require("express"),
 router = express.Router()
const {createuser, verifyotp, login,user_login, resendOTP,getProduct,profile,user1,orderHistory,reset_password_request, reset_password_set,razorpay_create_payment} = require("../controller/controller")

// console.log(">>>>Route");
router.post("/signup", createuser);
router.post("/login", login);
router.get('/user_login',user_login)
router.post("/verifyotp/:phone", verifyotp);
router.post("/resendOTP/:phone", resendOTP);
router.get("/getProduct",getProduct);
router.get("/profile/:userId",profile);
router.post("/user1place",user1);
router.get("/orderHistory",orderHistory);
router.post("/reset_password_request",reset_password_request);
router.get("/reset_password_set/:token", reset_password_set);
router.post("/razorpay_create_payment",razorpay_create_payment);

module.exports = router ;



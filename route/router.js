var express = require("express"),
 router = express.Router()
const {createuser, verifyotp, login,user_login, resendOTP,getProduct,profile,user1,orderHistory,reset_password_request, reset_password_set,razorpay_create_payment,payment_callback,add_Money,notification,getNotification,loginUserchangePassword} = require("../controller/controller");
const authToken = require("../middleware/auth");

// console.log(">>>>Route");
router.post("/signup", createuser);
router.post("/login", login);
router.post('/user_login',user_login)
router.post("/verifyotp/:phone", verifyotp);
router.post("/resendOTP/:phone", resendOTP);
router.get("/getProduct",getProduct);
router.get("/profile/:userId",profile);
router.post("/user1place",user1);
router.get("/orderHistory",orderHistory);
router.post("/reset_password_request",reset_password_request);
router.get("/reset_password_set/:token", reset_password_set);
router.post("/razorpay_create_payment",authToken,razorpay_create_payment);
router.post("/payment_confirmed",payment_callback);
router.post("/add_Money",add_Money);
router.post("/notification",notification);
router.get("/getNotification/:userId",getNotification);
router.post("/loginUserchangePassword/:userId",loginUserchangePassword);

module.exports = router ;



var express = require("express"),
 router = express.Router()
const {createuser, verifyotp, login,user_login, resendOTP,getProduct,profile,orderProduct,orderHistory,reset_password_request, reset_password_set,razorpay_create_payment,payment_callback,add_Money,notification,getNotification,loginUserchangePassword,orderEstampService,services_create_payment,services_payment_success,generate_api_key,identifyApiKey,Edit_User_profile_addImage,getServices,getOrder} = require("../controller/controller");
const authToken = require("../middleware/auth");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// console.log(">>>>Route");
router.post("/signup", createuser);
router.post("/login", login);
router.post('/user_login',user_login)
router.post("/verifyotp/:phone", verifyotp);
router.post("/resendOTP/:phone", resendOTP);
router.get("/getProduct",authToken,getProduct);
router.get("/profile/:userId",authToken,profile);
router.post("/reset_password_request",authToken,reset_password_request);
router.get("/reset_password_set/:token",authToken,reset_password_set);

router.post("/add_Money",authToken,add_Money);
router.post("/notification",notification);
router.get("/getNotification/:userId",getNotification);
router.post("/loginUserchangePassword/:userId",loginUserchangePassword);

router.post("/generate_api_key",authToken,generate_api_key);
router.get("/identifyApiKey",authToken,identifyApiKey);

router.post("/profileUpdateUser/:id",upload.single('profileImage'),Edit_User_profile_addImage);
router.get("/getServices",getServices);
// ======================================================

router.post("/orderProduct",authToken,orderProduct);  //order product

router.post("/razorpay_create_payment",authToken,razorpay_create_payment);
router.post("/payment_confirmed",payment_callback);
router.get("/orderHistory",authToken,orderHistory);  // get all order


router.post("/orderEstampService",authToken,orderEstampService);
router.post("/services_create_payment",authToken,services_create_payment);
router.post("/services_payment_success",authToken,services_payment_success);



module.exports = router;



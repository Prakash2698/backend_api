var express = require("express"),
 router = express.Router()
const {createuser, verifyotp, login, resendOTP,getProduct} = require("../controller/controller")

// console.log(">>>>Route");
router.post("/signup", createuser);
router.post("/login", login);
router.post("/verifyotp/:phone", verifyotp);
router.post("/resendOTP/:phone", resendOTP);
router.get("/getProduct",getProduct);

module.exports = router ;



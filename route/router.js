var express = require("express"),
 router = express.Router()
const {createuser, verifyotp, login, resendOTP,getProduct,profile,user1,orderHistory} = require("../controller/controller")

// console.log(">>>>Route");
router.post("/signup", createuser);
router.post("/login", login);
router.post("/verifyotp/:phone", verifyotp);
router.post("/resendOTP/:phone", resendOTP);
router.get("/getProduct",getProduct);
router.get("/profile/:userId",profile);
router.post("/user1place",user1);
router.get("/orderHistory",orderHistory);

module.exports = router ;



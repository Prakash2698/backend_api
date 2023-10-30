var express = require("express"),
 router = express.Router()
 const multer = require("multer");
 const authToken = require("../middleware/auth")
 const {userkyc,updateKYCStatus} = require("../controller/kycController")
 
 const upload = multer({ dest: 'uploads/' });

// console.log(">>>>Route");
router.post("/userKyc",authToken,upload.fields([{ name: 'aadharFrontImage', maxCount: 1 }, { name: 'aadharBackImage', maxCount: 1 },{ name: 'panImage', maxCount: 1 }]), userkyc);

router.post("/updateKYCStatus",authToken, updateKYCStatus);

module.exports = router;
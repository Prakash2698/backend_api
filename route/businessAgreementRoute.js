var express = require("express"),
router = express.Router()
const multer = require("multer")
const upload = multer({ dest: 'uploads/' });
const authToken = require("../middleware/auth");
 const businessController = require('../controller/businessAgreement');

 router.post("/bussiness_agreement",authToken,upload.fields([{ name: 'businessRegistrationProof', maxCount: 1 }, { name: 'business_PAN_CARD', maxCount: 1 },{ name: 'BusinessGST', maxCount: 1 }, { name: 'agreement_file', maxCount: 1 }]),businessController.bussinessA);




 module.exports = router ;
var express = require("express"),
 router = express.Router();
 const multer = require("multer");
 const upload = multer({ dest: 'uploads/' });
 const authToken = require("../middleware/auth");
const admin = require('../controller/adminController');


router.get("/user_list",authToken,admin.userget);
router.post("/addUser",admin.adminAddUser);
router.post("/editUser/:id",admin.adminEditUser);
router.post("/verifyKycByAdmin/:userId",authToken,admin.verifyKycByAdmin);
router.post("/addProduct",upload.fields([{ name: 'productImage', maxCount: 1 }]),admin.addProduct);
router.post("/addservice",admin.e_Stamp);
router.get("/getKycDocument",admin.getKycDocument);
router.post("/checkValidityExpiration",admin.checkValidityExpiration)

router.get("/getOneUser/:userId",admin.getOneUser);

module.exports = router;


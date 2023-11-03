var express = require("express"),
 router = express.Router();
// ============== multer code ==================================
 const multer = require("multer");
 const upload = multer({ dest: 'uploads/' });

 const authToken = require("../middleware/auth");
const admin = require('../controller/adminController');


router.get("/user_list",authToken,admin.userget);
router.post("/addUser",admin.adminAddUser);
router.post("/editUser/:id",admin.adminEditUser);
router.post("/verifyKycByAdmin/:userId",authToken,admin.verifyKycByAdmin);

router.post("/addProduct",upload.single("productImage"),admin.addProduct);

router.post("/addservice",admin.e_Stamp);
router.get("/getKycDocument",admin.getKycDocument);
router.get("/getbussinessA",authToken,admin.getbussinessA);
router.get("/getOneUser/:userId",admin.getOneUser);
// ===== check validity dateTime [] 7days monthly yearly life_time ] =============
router.get("/checkValidityExpiration/:orderId",admin.checkValidityExpiration);


module.exports = router;


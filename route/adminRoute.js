var express = require("express"),
 router = express.Router();
 const multer = require("multer");
 const upload = multer({ dest: 'uploads/' });
 const authToken = require("../middleware/auth");
const admin = require('../controller/adminController');


router.get("/user_list",admin.userget);
router.post("/addUser",admin.adminAddUser);
router.post("/editUser/:id",admin.adminEditUser);
router.post("/verifyKycByAdmin/:userId",authToken,admin.verifyKycByAdmin);
router.post("/addProduct",upload.fields([{ name: 'productImage', maxCount: 1 }]),admin.addProduct);

module.exports = router;


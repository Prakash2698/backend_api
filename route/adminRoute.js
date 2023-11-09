var express = require("express"),
 router = express.Router();
// ============== multer code ==================================
 const multer = require("multer");
//  const upload = multer({ dest: 'uploads/' });
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extname = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + extname);
    },
    // filename: function (req, file, cb) {
    //     cb(null, file.originalname); // Keep the original file name
    //   },
  });
  const upload = multer({ storage });

 const authToken = require("../middleware/auth");
const admin = require('../controller/adminController');


router.get("/user_list",authToken,admin.userget);
router.post("/addUser",admin.adminAddUser);
router.post("/editUser/:id",admin.adminEditUser);
router.post("/verifyKycByAdmin/:userId",authToken,admin.verifyKycByAdmin);

router.post("/addProduct",upload.fields([{ name: 'productImage', maxCount: 1 }]),admin.addProduct);
// router.post("/addProduct",upload.single('productImage'),admin.addProduct);


router.post("/addservice",admin.e_Stamp);

router.get("/getclient_send_data_admin",admin.getclient_send_data);
// ======export file for user============ table==================================
router.post("/exportAdminFile/:userId",admin.exportAdminFile);

router.get("/getKycDocument",admin.getKycDocument);
router.get("/getbussinessA",authToken,admin.getbussinessA);
router.get("/getOneUser/:userId",admin.getOneUser);
// ===== check validity dateTime [] 7days monthly yearly life_time ] =============
router.get("/checkValidityExpiration/:orderId",admin.checkValidityExpiration);

router.post("/logo",upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'newLogo', maxCount: 1 }]), admin.logo);

// router.post("/logo",upload.fields([{ name: 'logo', maxCount: 1 },{ name: 'newLogo', maxCount: 1 }])
// ,admin.logo);

module.exports = router;


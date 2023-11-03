var express = require("express"),
 router = express.Router()
 const multer = require("multer");
 const authToken = require("../middleware/auth")
 const {userkyc,updateKYCS} = require("../controller/kycController")


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
  });
  const upload = multer({ storage });
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//  const upload = multer({ dest: 'uploads/' });
router.post("/userKyc",authToken,upload.fields([{ name: 'aadharFrontImage', maxCount: 1 }, { name: 'aadharBackImage', maxCount: 1 },{ name: 'panImage', maxCount: 1 }]), userkyc);

router.post("/updateKYCS/:kycId", upload.array('aadharFrontImage', 1),authToken, updateKYCS);

module.exports = router;
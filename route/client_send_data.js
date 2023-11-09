var express = require("express"),
router = express.Router();
const authToken = require("../middleware/auth");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// ===========
const clientsenddata = require("../controller/client_send_data");

router.post("/client_send_data",authToken,upload.single('pdfImage'),clientsenddata.client_send_data);
router.get("/getclient_send_data",clientsenddata.getclient_send_data);

module.exports = router ;
const kycSchema = require("../model/kyc");
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// const userkyc = async (req, res) => {
//     try {
//         const { aadharNo, panNo } = req.body; // Destructure the request body
//         // console.log(aadharNo, panNo);
//         const aadharFrontImage = req.files.aadharFrontImage;
//         // console.log(">>>>>aadharFrontImage",aadharFrontImage);
//         const aadharBackImage = req.files.aadharBackImage;   
//         const panImage = req.files.panImage;
        
//         const user = req.user._id;

//         const userKyc = new kycSchema({
//             aadharNo,
//             panNo,
//             aadharFrontImage,
//             aadharBackImage,
//             panImage,
//             userId:user
//         })
//         console.log(userKyc, ">>>>>>>>>>>>>>>>");
//         const savekyc = await userKyc.save();
//         res.send({ status: 200, sucess: true, result: savekyc })

//     } catch (error) {
//         console.log(">>>>>",error);
//         res.status(500).send({ error: 'Error KYC saving data' });
//     }
// }
const userkyc = async (req, res) => {
  try {
      const { aadharNo, panNo } = req.body;
        // Check if the files were uploaded successfully
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ error: 'No files were uploaded.' });
    }
    const aadharFrontImage = req.files.aadharFrontImage[0].originalname;
    const aadharBackImage = req.files.aadharBackImage[0].originalname;
    const panImage = req.files.panImage[0].originalname;

      const user = req.user._id;

      const userKyc = new kycSchema({
          aadharNo,
          panNo,
          aadharFrontImage,
          aadharBackImage,
          panImage,
          userId: user,
      });

      const savekyc = await userKyc.save();
      res.send({ status: 200, success: true, result: savekyc });
  } catch (error) {
      console.log("Error:", error);
      res.status(500).send({ error: 'Error KYC saving data' });
  }
};


const updateKYCStatus = async(req,res)=>{
    try {
      const { kycId } = req.params;
      const newStatus = req.body.status;  
      if (!newStatus || !['active', 'completed', 'pending'].includes(newStatus)) {
        return res.status(400).json({ error: 'Invalid status' });
      }  
      const updatedKYC = await kycSchema.findByIdAndUpdate(
        kycId,
        { status: newStatus },
        { new: true }
      );  
      if (!updatedKYC) {
       res.status(404).send({ error: 'KYC record not found' });
      }
  
      res.send({sucess:true ,result:updatedKYC});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating KYC status' });
    }
  
  }

module.exports = {
    userkyc,
    updateKYCStatus
}
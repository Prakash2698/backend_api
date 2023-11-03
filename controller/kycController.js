const kycSchema = require("../model/kyc");
const Notification = require('../model/notificationBar');
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
// const userkyc = async (req, res) => {
//   try {
//       const { aadharNo, panNo,GST_Number , DOB , Address, phone , email} = req.body;
//         // Check if the files were uploaded successfully
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).send({ error: 'No files were uploaded.' });
//     }
//     const aadharFrontImage = req.files.aadharFrontImage[0].originalname;
//     const aadharBackImage = req.files.aadharBackImage[0].originalname;
//     const panImage = req.files.panImage[0].originalname;

//       const user = req.user._id;

//       const userKyc = new kycSchema({
//         aadharNo,
//         panNo,
//         GST_Number,
//         aadharFrontImage,
//         aadharBackImage,
//         panImage,
//         DOB,
//         Address,
//         phone,
//         email,
//         userId: user,
//       });

//       const savekyc = await userKyc.save();
//       res.send({ status: 200, success: true, result: savekyc });
//   } catch (error) {
//       console.log("Error:", error);
//       res.status(500).send({ error: 'Error KYC saving data' });
//   }
// };
const userkyc = async (req, res) => {
  try {
    const { aadharNo, panNo, GST_Number, DOB, Address, phone, email } = req.body;

    // Check if the files were uploaded successfully
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ error: 'No files were uploaded.' });
    }
    const aadharFrontImage = req.files.aadharFrontImage[0].path;
    const aadharBackImage = req.files.aadharBackImage[0].path;
    const panImage = req.files.panImage[0].path;
    // console.log(req.files,">>>>>>>>>>>>>>>>");

    // Parse the single "Address" field into separate subfields
    const addressData = JSON.parse(Address);

    // Validate the required fields within the "Address" data
    if (!addressData || !addressData.address || !addressData.city || !addressData.state || !addressData.Pin_Code) {
      return res.status(400).json({ error: 'Address data is incomplete.' });
    }
    const user = req.user._id;
    const userKyc = new kycSchema({
      aadharNo,
      panNo,
      GST_Number,
      aadharFrontImage,
      aadharBackImage,
      panImage,
      DOB,
      Address: addressData, // Assign the parsed address data
      phone,
      email,
      userId: user,
    });
    const savekyc = await userKyc.save();
    const notification = new Notification({
      message: "kyc submitted"
    });
    await notification.save();
    res.status(200).json({ success: true, result: savekyc });
    // aadharBackImage,
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error saving KYC data' });
  }
};


const updateKYCS = async (req, res) => {
  try {
    const { aadharNo, panNo, GST_Number, DOB, Address, phone, email, kycStatus } = req.body;
    // Check if the KYC data ID is provided in the URL
    const kycId = req.params.kycId;
    // Find the KYC data to update by its ID
    const existingKycData = await kycSchema.findById(kycId);
    if (!existingKycData) {
      return res.status(404).json({ error: 'KYC data not found.' });
    }
    // Check if files have been uploaded
    if (req.files && req.files.length > 0) {
      // Update the file-related fields as needed (e.g., aadharFrontImage)
      existingKycData.aadharFrontImage = req.files[0].originalname;
      // Update other file-related fields as needed
    }

    // Update the KYC data fields
    existingKycData.aadharNo = aadharNo;
    existingKycData.panNo = panNo;
    existingKycData.GST_Number = GST_Number;
    existingKycData.DOB = DOB;
    existingKycData.Address = Address; // Assuming Address is sent as a JSON string
    existingKycData.phone = phone;
    existingKycData.email = email;
    existingKycData.kycStatus = kycStatus;

    // Save the updated KYC data
    const updatedKycData = await existingKycData.save();

    res.status(200).json({ success: true, result: updatedKycData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error updating KYC data' });
  }


}

module.exports = {
  userkyc,
  updateKYCS
}
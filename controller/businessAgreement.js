const businessASchema = require("../model/businessAgreement");


const bussinessA = async (req, res) => {
    try {
        // Assuming you're using the field names 'aadharFrontImage', 'aadharBackImage', and 'panImage'
        // const aadharFrontImage = req.files.aadharFrontImage[0].originalname;
        // console.log(">>>>>>>>....");
        const businessRegistrationProof = req.files.businessRegistrationProof[0].originalname;
        // console.log(">>>>>>>>>>>>>",businessRegistrationProof);
        const business_PAN_CARD = req.files.business_PAN_CARD[0].originalname;
        const BusinessGST = req.files.BusinessGST[0].originalname;
        const agreement_file = req.files.agreement_file[0].originalname;

        const user = req.user._id;
        // console.log(user,"?????????????");
        const bussinessFile = new businessASchema({
            businessRegistrationProof,
            business_PAN_CARD,
            BusinessGST,
            agreement_file,
            userId: user
        });

        // Save to the database
        const file = await bussinessFile.save();
        // console.log(file, "document_not_found");
        res.status(200).send({ success: true, result: file });
    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    bussinessA
}
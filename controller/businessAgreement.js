const businessASchema = require("../model/businessAgreement");


const bussinessA = async(req,res)=>{
    try {
        // console.log(">>>>>>>>....");
        const businessRegistrationProof = req.files.businessRegistrationProof;
        // console.log(">>>>>>>>>>>>>",businessRegistrationProof);
        const business_PAN_CARD = req.files.business_PAN_CARD;
        const BusinessGST = req.files.BusinessGST;
        const agreement_file = req.files.agreement_file;
        const user = req.user._id;
// console.log(user,"?????????????");
        const bussinessFile = new businessASchema({
            businessRegistrationProof,
            business_PAN_CARD,
            BusinessGST,
            agreement_file,
            userId:user
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
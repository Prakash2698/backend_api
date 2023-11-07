const client_senddata = require("../model/client_send_data");


// const client_send_data = async (req, res) => {
//     try {
//         const { Stamp_Duty_Value, First_Party_Name, Second_Party_Name, Consideration_Price, Purpose_of_Stamp_Duty, Stamp_Duty_Paid_By } = req.body;  
//         // const pdfImage = req.file.buffer;
//         const pdfImage = req.file.path;

//         console.log(req.file);
//         console.log(">>>>>>>>>>>>",pdfImage);
//         // return
//         const clientSend = new client_senddata({
//             pdfImage,
//             Stamp_Duty_Value,
//              First_Party_Name, 
//              Second_Party_Name, 
//              Consideration_Price, 
//              Purpose_of_Stamp_Duty, 
//              Stamp_Duty_Paid_By
//         });
//         const clientSendD = await clientSend.save();
//         console.log(clientSendD);
//         if (!clientSendD) {
//             res.send({ status: 400, message: "data not save" })
//         }
//         res.send({ status: 200, message: "data saved", result: clientSendD })
//     } catch (error) {
//           console.log(error);
//     }
// }

const client_send_data = async (req, res) => {
    try {        
        const {
            Stamp_Duty_Value,
            First_Party_Name,
            Second_Party_Name,
            Consideration_Price,
            Purpose_of_Stamp_Duty,
            Stamp_Duty_Paid_By,
        } = req.body;
        const user = req.user._id;
        
        const pdfImage = req.file.path;
        const clientSend = new client_senddata({
            pdfImage,
            Stamp_Duty_Value,
            First_Party_Name,
            Second_Party_Name,
            Consideration_Price,
            Purpose_of_Stamp_Duty,
            Stamp_Duty_Paid_By,
            userId: user
        });

        // Save the document to the database
        const clientSendD = await clientSend.save();
        if (!clientSendD) {
            return res.status(400).json({ status: 400, message: "Data not saved" });
        }
        return res.status(200).json({ status: 200, message: "Data saved", result: clientSendD });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred" });
    }
};
const getclient_send_data = async (req, res) => {
    try {
        const find = await client_senddata.find();
        if (!find) {
            res.send({ message: "client data not found" })
        }
        res.send({ status: 200, message: "data_found", result: find })
    } catch (error) {
        console.log(error);
    }

}

const deduct_charge_perHit = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    client_send_data,
    getclient_send_data
}
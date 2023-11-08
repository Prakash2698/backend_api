const client_senddata = require("../model/client_send_data");
const perHit_Charge = require("../model/perHitCharge");
const newuserSchema = require("../model/model");

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



// const deduct_charge_perHit = async (req, res) => {
//     try {
//         //   const { userId, amount } = req.body;
//         const userId = req.params._id;
//         const perHitCharge = req.body;
//         // Validate the userId and amount
//         if (!userId || !perHitCharge) {
//             return res.status(400).json({ success: false, msg: 'Invalid userId or perHitCharge' });
//         }
//         // Find the user by their userId
//         const user = await newuserSchema.findOne({ _id: userId });
//         if (!user) {
//             return res.status(404).json({ success: false, msg: 'User not found' });
//         }
//         // Perform the "deductMoney" operation by updating the user's wallet
//         const parsedAmount = parseFloat(perHitCharge);
//         if (isNaN(parsedAmount)) {
//             return res.status(400).json({ success: false, msg: 'Invalid amount format' });
//         }
//         const newWallet = new wallet_amount({
//             userId: userId,
//             addAmount: parsedAmount,
//         });
//         await newWallet.save();
//         // Update the user's wallet amount
//         user.wallet_amount -= parsedAmount;
//         await user.save();

//         return res.status(200).json({ success: true, msg: 'Money deducted successfully', user_walletAmount: user.wallet_amount });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, msg: 'An error occurred' });
//     }
// };

const deduct_charge_perHit = async (req, res) => {
    try {
        const userId = req.params._id;
        const perHitCharge = req.body.perHitCharge;

        // Validate the userId and perHitCharge
        if (!userId || !perHitCharge) {
            return res.status(400).json({ success: false, msg: 'Invalid userId or perHitCharge' });
        }

        // Check if perHitCharge is a valid number
        if (isNaN(perHitCharge) || parseFloat(perHitCharge) <= 0) {
            return res.status(400).json({ success: false, msg: 'Invalid perHitCharge format' });
        }

        // Find the user by their userId
        const user = await newuserSchema.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        // Create a new PerHitCharge instance and save it to the database
        const newPerHitCharge = new perHit_Charge({
            userId: userId,
            perHitCharge: perHitCharge,
        });

        await newPerHitCharge.save();

        // Update the user's wallet amount
        user.wallet_amount -= perHitCharge;
        await user.save();

        return res.status(200).json({ success: true, msg: 'Money deducted successfully', user_walletAmount: user.wallet_amount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'An error occurred' });
    }
};



module.exports = {
    client_send_data,
    getclient_send_data,
    deduct_charge_perHit
}
const newuserSchema = require("../model/model");
const userSchema = require("../model/adminAddUser");
const verifyKyc = require("../model/kyc");
const product = require('../model/admin/addProduct');
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const helper = require("../helper/helper");
const nodemailer = require('nodemailer');

const addService = require("../model/admin/service");
const orderEstampService = require("../model/admin/orderEstamService");
// const bussiness_agreement = require("../model/businessAgreement");

const bussiness_agreement = require("../model/businessAgreement");
const logoImage = require("../model/admin/websiteSettingLOGO");
const client_senddata = require("../model/client_send_data");


const userget = async (req, res) => {
    try {
        const userList = await newuserSchema.find()
        console.log(userList, ">>>>>>>>>>...");
        if (!userList) {
            res.send({ sucess: false, message: "userList_not_found" })
        }
        res.send({ sucess: true, result: userList })
    } catch (error) {
        console.log(error)
    }

}

// const adminAddUser = async (req, res) => {
//     try {
//         const { name, phone, email, password } = req.body; // Destructure the request body

//         if (!email) {
//             res.status(400).send({ success: false, msg: "Email is required" });
//             return;
//         }
//         if (!password) {
//             res.status(400).send({ success: false, msg: "Password is required" });
//             return;
//         }
//         // Check if the email already exists in the database using the check.findUser function
//         const userData = await userSchema.findOne({ email: email } && { phone: phone });

//         if (userData) {
//             res.status(201).send({ success: false, msg: "Email or phone already exists" });
//         } else {
//             // Hash the password before saving it in the database
//             const hashedPassword = bcrypt.hashSync(password, 10);
//             // Create a new user instance using the Mongoose model
//             const newUser = new userSchema({
//                 name,
//                 phone,
//                 email,
//                 password: hashedPassword // Set the hashed password
//             });
//             // console.log(">>>>>>>>>>>>>>>>>>...",newUser);
//             // Save the new user to the database
//             const user_data = await newUser.save();
//             console.log(user_data, "user saved in the database by Admin");
//             res.status(200).send({ success: true, data: user_data });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({ status: 400, message: error.message });
//     }
// }
const adminAddUser = async (req, res) => {
    try {
        // Destructure user data from the request body
        const { name, phone, email, password } = req.body;
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, msg: 'Email and password are required' });
        }

        // Generate a unique partner ID (you can use a library like `uuid` for this)
        const partnerId = helper.generatePartnerId();
        // Check if the email already exists in the database using the check.findUser function
        const userData = await userSchema.findOne({ email: email } && { phone: phone });
        if (userData) {
            res.status(201).send({ success: false, msg: "Email or phone already exists" });
        } else {
            // Hash the user's password
            const hashedPassword = bcrypt.hashSync(password, 10);
            // Generate a token for the user
            const token = jwt.sign({ email }, process.env.SECRET_KEY); // Replace 'your-secret-key' with a secret key

            // Create a new user instance
            const newUser = new userSchema({
                name,
                phone,
                email,
                password: hashedPassword,
                partnerId,
                token,
            });
            // Save the new user to the database
            const user_data = await newUser.save();
            // res.status(200).json({ success: true, data: user_data });
            // Send an email with the partnerId
            const transporter = nodemailer.createTransport({
                host: 'weberse.in',
                port: 465,
                secure: true,
                auth: {
                    user: 'info@weberse.live',
                    pass: 'Pp@7884294',
                    authMethod: 'PLAIN', // Specify the authentication method ('LOGIN' or 'PLAIN' for most email providers)
                },
            });
            const mailOptions = {
                from: 'info@weberse.live',
                to: email,
                subject: partnerId,
                text: `Your Partner ID is: ${partnerId}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    res.status(400).send({ success: false, msg: "Email sending failed" });
                } else {
                    console.log("Email sent:", info.response);
                    res.status(200).send({ success: true, data: user_data });
                }
            });
        }
        // }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'An error occurred' });
    }
}

const getOneUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await userSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'An error occurred' });
    }
}

const adminEditUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, phone, email, password } = req.body;
        const update = await userSchema.findByIdAndUpdate(
            id, // Use id as a string
            {
                name,
                phone,
                email,
                password
            },
            { new: true }
        );
        // console.log(">>>>>>update", update);
        if (!update) {
            res.status(404).send({ message: "user_not_found" });
        } else {
            res.send({ sucess: true, result: update });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: error.message });
    }
}

// const verifyKycByAdmin = async (req, res) => {
//     try {
//         const userId = req.params.userId;
//         const { kycStatus } = req.body;

//         // First update: Update the "status" field in verifyKyc
//         const firstUpdate = await verifyKyc.findOneAndUpdate(
//             { userId: userId }, // Pass the _id directly
//             { kycStatus: kycStatus },
//             { new: true }
//         );
//         if (!firstUpdate) {
//             res.status(404).send({ message: "User not found in verifyKyc" });
//             return;
//         }
//         else {
//             res.send({ success: true, result: firstUpdate });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({ status: 400, message: error.message });
//     }
// };


// const verifyKycByAdmin = async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const { kycStatus } = req.body;

//       // First update: Update the "kycStatus" field in verifyKyc
//       const firstUpdate = await verifyKyc.findOneAndUpdate(
//         { userId: userId },
//         { kycStatus: kycStatus },
//         { new: true }
//       );

//       if (!firstUpdate) {
//         res.status(404).send({ message: "User not found in verifyKyc" });
//         return;
//       }

//       if (kycStatus === "approved") {
//         // If kycStatus is "approved," send an email
//         await sendApprovalEmail(userId); // Implement this function
//       }

//       res.send({ success: true, result: firstUpdate });
//     } catch (error) {
//       console.error(error);
//       res.status(400).send({ status: 400, message: error.message });
//     }
//   };



const verifyKycByAdmin = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { kycStatus } = req.body;

        // First update: Update the "kycStatus" field in verifyKyc
        const firstUpdate = await verifyKyc.findOneAndUpdate(
            { userId: userId },
            { kycStatus: kycStatus },
            { new: true }
        );
        // console.log(firstUpdate)
        if (!firstUpdate) {
            res.status(404).send({ message: "User not found in verifyKyc" });
            return;
        }
        // Send email notification based on kycStatus
        if (kycStatus === 'approved' || kycStatus === 'rejected' || kycStatus === 'pending') {
            const userEmail = firstUpdate.email; // Get the user's email from your user data or elsewhere
            console.log(userEmail);
            // Set up Nodemailer to send an email
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                host: 'weberse.in',
                port: 465,
                secure: true,
                auth: {
                    user: 'info@weberse.live',
                    pass: 'Pp@7884294',
                    authMethod: 'PLAIN',
                }
            });
            const mailOptions = {
                from: 'info@weberse.live',
                to: userEmail,
                subject: `KYC Status Update: ${kycStatus}`,
                text: `Your KYC status has been updated to ${kycStatus}.`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    // console.log("Email sent:", info.response);
                    console.log('Email sent:', info.response);
                }
            });
        }
        res.send({ success: true, result: firstUpdate });
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: error.message });
    }
};

const getKycDocument = async (req, res) => {
    try {
        const userList = await verifyKyc.find()
        console.log(userList, ">>>>>>>>>>...");
        if (!userList) {
            res.send({ sucess: false, message: "userList_not_found" })
        }
        res.send({ sucess: true, result: userList })
    } catch (error) {
        console.log(error)
    }
}

const getbussinessA = async (req, res) => {
    try {
        const bussinessagreement = await bussiness_agreement.find()
        console.log(bussinessagreement, ">>>>>>>>>>...");
        if (!bussiness_agreement) {
            res.send({ sucess: false, message: "bussiness_agreement_not_found" })
        }
        res.send({ sucess: true, result: bussinessagreement })
    } catch (error) {
        console.log(error)
    }
}

// const addProduct = async (req, res) => {
//     try {
//         const { productName, productPrice, quantity } = req.body; // Destructure the request body

//        const  productImage = req.files.productImage;
//         // Check if the email already exists in the database using the check.findUser function
//         const find = await product.findOne({ productName: productName });

//         if (find) {
//             res.status(201).send({ success: false, msg: "product already exists" });
//         } else {
//             // Create a add product  instance using the Mongoose model
//             const add_product = new product({
//                 productName,
//                 productImage,
//                 productPrice,
//                 quantity  
//             });
//             // console.log(">>>>>>>>>>>>>>>>>>...",add_product);
//             // Save the new user to the database
//             const addProduct = await add_product.save();
//             console.log(addProduct, "product add in database");
//             res.status(200).send({ success: true, result: addProduct });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(400).send({ status: 400, message: "product add faield" });
//     }
// };

const addProduct = async (req, res) => {
    try {
        const { productName, category, productPrice, description, productLink } = req.body; // Destructure the 
        const productImage = req.files.productImage[0].path;
        console.log(productImage);
        console.log(req.files);
        // return
        const find = await product.findOne({ productName: productName });
        if (find) {
            res.status(201).send({ success: false, msg: "product already exists" });
        } else {
            // Create a add product  instance using the Mongoose model
            const add_product = new product({
                productName,
                category,
                productImage,
                productPrice,
                description,
                productLink
            });
            // console.log(">>>>>>>>>>>>>>>>>>...",add_product);
            // Save the product to the database
            const addProduct = await add_product.save();
            // console.log(addProduct, "product add in database");
            res.status(200).send({ success: true, result: addProduct });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: "product add faield" });
    }
};
// =============== addService eStamp api ======================================
const e_Stamp = async (req, res) => {
    try {
        const { SName, activationPrice, validity, type ,description} = req.body;
        
        // Assuming that perHitCharge and hit_limit are also provided in the request
        const { perHitCharge, hit_limit } = req.body;

        // Create a new instance of the model_eStamp schema
        const newEstamp = new addService({
            SName,
            activationPrice,
            type: {
                perHitCharge,
                hit_limit,
            },
            validity,
            description
        });

        // Save the new instance to the database
        await newEstamp.save();

        res.status(201).send({ success: true, newEstamp });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: 'An error occurred' });
    }
}


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

const exportAdminFile = async (req, res) => {
    try {
        const userId = req.params.userId; // Get the client_senddata document's _id
        const { status, adminFile } = req.body;
        
        // Update the status in the client_senddata collection
        const updatedClientData = await client_senddata.findOneAndUpdate(
            {userId:userId}, {
                status }, 
                { new: true });
                // console.log(updatedClientData);
        if (!updatedClientData) {
            return res.status(404).json({ status: 404, message: "Client data not found" });
        }
        // Assuming you have a unique identifier for the user (e.g., email or userId)
        const userIdentifier = updatedClientData.userId;
        // Find the user by their identifier in the newuserSchema
        const user = await newuserSchema.findOne({_id:userIdentifier});
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        user.adminFile = adminFile;
        await user.save();

        res.status(200).json({ status: 200, message: "Success", result: updatedClientData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred" });
    }
};



const checkValidityExpiration = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        if (orderId) {
            // Find the service order by _id
            const order = await orderEstampService.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: 'Service order not found' });
            }

            // Calculate expiration date based on the validity
            let expirationDate = new Date(order.created);
            switch (order.validity) {
                case '7days':
                    expirationDate.setDate(expirationDate.getDate() + 7);
                    break;
                case 'monthly':
                    expirationDate.setMonth(expirationDate.getMonth() + 1);
                    break;
                case 'yearly':
                    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
                    break;
                case 'life_Time':
                    // No expiration for 'life_Time'
                    break;
                default:
                    return res.status(400).json({ message: 'Invalid validity' });
            }

            // Check if the order has expired
            const currentDate = new Date();
            const isExpired = currentDate > expirationDate;

            // Update the status to 'expired' if the order is expired
            if (isExpired) {
                order.status = 'expired';
                await order.save();
            }

            res.status(200).json({
                message: 'Service order validity checked',
                order,
                isExpired,
            });
        } else {
            // Find service orders with 'success' status
            const validOrders = await orderEstampService.find({ status: 'success' });

            // Calculate the current date
            const currentDate = new Date();

            // Update status and check validity for each order
            validOrders.forEach(async (order) => {
                // Calculate expiration date based on the validity
                let expirationDate = new Date(order.created);
                switch (order.validity) {
                    case '7days':
                        expirationDate.setDate(expirationDate.getDate() + 7);
                        break;
                    case 'monthly':
                        expirationDate.setMonth(expirationDate.getMonth() + 1);
                        break;
                    case 'yearly':
                        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
                        break;
                    case 'life_Time':
                        // No expiration for 'life_Time'
                        break;
                    default:
                        return;
                }

                if (currentDate > expirationDate) {
                    // If expired, update the order status to 'expired'
                    order.status = 'failed';
                    await order.save();
                }
            });

            res.status(200).json({ message: 'Service order validity checked and status updated' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
}

const logo = async (req, res) => {
    try {
        const { name, websiteIS } = req.body;
        const logo = req.files.logo[0].path;
        // console.log(req.files);  
        // return;
        const newLogo = req.files.newLogo[0].path;
        const logo_Image = new logoImage({
            name,
            logo,
            newLogo,
            websiteIS
        })
        await logo_Image.save();
        if (!logo_Image) {
            res.send({ status: 402, message: "deatiles not found" });
        }
        res.send({ status: 200, message: "logo uploaded", result: logo_Image });
    } catch (error) {
        console.log(error);
    }

}


module.exports = {
    userget,
    getOneUser,
    adminAddUser,
    adminEditUser,
    verifyKycByAdmin,
    getKycDocument,
    getbussinessA,
    addProduct,
    e_Stamp,
    getclient_send_data,
    exportAdminFile,
    checkValidityExpiration,
    logo
}




// const transporter = nodemailer.createTransport({
//     host: 'weberse.in',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'info@weberse.live',
//         pass: 'Pp@7884294',
//         authMethod: 'PLAIN',
//     },
// });
// const mailOptions = {
//     from: 'info@weberse.live',
//     to: email,
//     subject: kycStatus,
//     text: `Your Partner ID is: ${kycStatus}\nVerify your email by clicking this link: ${verificationLink}`,
// };
// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         console.error(error);
//         res.status(400).send({ success: false, msg: "Email sending failed" });
//     } else {
//         console.log("Email sent:", info.response);
//         res.status(200).send({ success: true, data: user_data, verificationLink });
//     }
// });
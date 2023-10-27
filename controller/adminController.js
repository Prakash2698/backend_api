const newuserSchema = require("../model/model");
const userSchema = require("../model/adminAddUser");
const verifyKyc = require("../model/kyc");
const product = require('../model/admin/addProduct');
var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const helper = require("../helper/helper");
const nodemailer = require('nodemailer');

const addService = require("../model/admin/modelEStamp");


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
        }else{
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
                  pass:'Pp@7884294',
                  authMethod: 'PLAIN', // Specify the authentication method ('LOGIN' or 'PLAIN' for most email providers)
                },
              });
            const mailOptions = {
                from:'info@weberse.live',
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

const getOneUser = async(req,res)=>{
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

const verifyKycByAdmin = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { status, userStatus } = req.body;
        console.log(userId, "userId>>>>>>>>>>>>");

        // First update: Update the "status" field in verifyKyc
        const firstUpdate = await verifyKyc.findOneAndUpdate(
            { userId: userId }, // Pass the _id directly
            { status },
            { new: true }
        );

        console.log("firstUpdate:", firstUpdate);
        // Second update: Update the "userStatus" field in newuserSchema
        const secondUpdate = await newuserSchema.findByIdAndUpdate(
            userId, // Pass the _id directly
            { userStatus },
            { new: true }
        );

        console.log("secondUpdate:", secondUpdate);

        if (!firstUpdate) {
            res.status(404).send({ message: "User not found in verifyKyc" });
            return;
        }

        if (!secondUpdate) {
            res.status(404).send({ message: "User not found in newuserSchema" });
        } else {
            res.send({ success: true, result: secondUpdate });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: error.message });
    }
};
const getKycDocument = async(req,res)=>{
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
        const { productName, category, productPrice, description } = req.body; // Destructure the request body        
        const productImage = req.files.productImage;
        // Check if the email already exists in the database using the check.findUser function
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
                description
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
// =============== eStamp api ======================================
const e_Stamp = async (req, res) => {
    // try {
    //     const { price, perHitCharge, validity } = req.body;
    //      // Validate the input for the "validity" field
    //      if (!['monthly', 'yearly', 'five_years', 'life_time'].includes(validity)) {
    //         return res.status(400).send({ success: false, error: 'Invalid validity option' });
    //     }
    //     const newEstamp = new modelEstamp({
    //         price,
    //         perHitCharge,
    //         validity
    //     });
    //     await newEstamp.save();
    //     res.status(201).send({ success: true, newEstamp });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ success: false, error: 'An error occurred' });
    // }
    try {
        const { price, perHitCharge, validity, monthly_hit } = req.body;
        const newEstamp = new addService({
            price,
            perHitCharge,
            validity,
            monthly_hit,
        });

        await newEstamp.save();
        res.status(201).send({ success: true, newEstamp });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: 'An error occurred' });
    }
}


module.exports = {
    userget,
    getOneUser,
    adminAddUser,
    adminEditUser,
    verifyKycByAdmin,
    getKycDocument,
    addProduct,
    e_Stamp
}
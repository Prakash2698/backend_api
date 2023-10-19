const newuserSchema = require("../model/model");
const userSchema = require("../model/adminAddUser");
const verifyKyc = require("../model/kyc");
const product = require('../model/admin/addProduct');
var mongoose = require('mongoose');
//  var str = '578df3efb618f5141202a196';
//  var mongoObjectId = mongoose.Types.ObjectId(str);
// ObjectId(userId)

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

const adminAddUser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body; // Destructure the request body

        if (!email) {
            res.status(400).send({ success: false, msg: "Email is required" });
            return;
        }
        if (!password) {
            res.status(400).send({ success: false, msg: "Password is required" });
            return;
        }
        // Check if the email already exists in the database using the check.findUser function
        const userData = await userSchema.findOne({ email: email } && { phone: phone });

        if (userData) {
            res.status(201).send({ success: false, msg: "Email or phone already exists" });
        } else {
            // Hash the password before saving it in the database
            const hashedPassword = bcrypt.hashSync(password, 10);
            // Create a new user instance using the Mongoose model
            const newUser = new userSchema({
                name,
                phone,
                email,
                password: hashedPassword // Set the hashed password
            });
            // console.log(">>>>>>>>>>>>>>>>>>...",newUser);
            // Save the new user to the database
            const user_data = await newUser.save();
            console.log(user_data, "user saved in the database by Admin");
            res.status(200).send({ success: true, data: user_data });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: error.message });
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
            res.status(404).send({message:"user_not_found"});
        }else{
            res.send({sucess:true ,result:update});
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
            {userId:userId}, // Pass the _id directly
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
const addProduct = async (req, res) => {
    try {
        const { productName, productPrice, quantity } = req.body; // Destructure the request body
        
       const  productImage = req.files.productImage;
        // Check if the email already exists in the database using the check.findUser function
        const find = await product.findOne({ productName: productName });

        if (find) {
            res.status(201).send({ success: false, msg: "product already exists" });
        } else {
            // Create a add product  instance using the Mongoose model
            const add_product = new product({
                productName,
                productImage,
                productPrice,
                quantity  
            });
            // console.log(">>>>>>>>>>>>>>>>>>...",add_product);
            // Save the new user to the database
            const addProduct = await add_product.save();
            console.log(addProduct, "product add in database");
            res.status(200).send({ success: true, result: addProduct });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: "product add faield" });
    }
};

const addProductList = async (req, res) => {
    try {
        const { productName,category,subcategory, color,material,dimensions, productPrice, quantity,productReviews,shippingInformation ,availabilityStatus,discounts,warranty,productsRating,relatedProducts } = req.body; // Destructure the request body
        
       const  productImage = req.files.productImage;
        // Check if the email already exists in the database using the check.findUser function
        const find = await product.findOne({ productName: productName });

        if (find) {
            res.status(201).send({ success: false, msg: "product already exists" });
        } else {
            // Create a add product  instance using the Mongoose model
            const add_product = new product({
                productName,
                category,
                subcategory,
                color,
                material,
                dimensions,
                productImage,
                productPrice,
                quantity,
                productReviews,
                shippingInformation,
                availabilityStatus,
                discounts,
                warranty,
                productsRating,
                relatedProducts
                
            });
            // console.log(">>>>>>>>>>>>>>>>>>...",add_product);
            // Save the new user to the database
            const addProduct = await add_product.save();
            console.log(addProduct, "product add in database");
            res.status(200).send({ success: true, result: addProduct });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ status: 400, message: "product add faield" });
    }
};


module.exports = {
    userget,
    adminAddUser,
    adminEditUser,
    verifyKycByAdmin,
    addProduct
}
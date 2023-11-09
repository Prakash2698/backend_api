const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = {
  
  sendMail: async (req, res) => {
    try {
      const {  to, subject, text } = req.body;

      const mailOptions = {
        from:"rajeshpushpakar01@gmail.com",
        to: to,
        subject: subject,
        text: text,
      };

      // Send the email and wait for it to complete
      await transporter.sendMail(mailOptions);

      console.log('Email sent successfully');
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};


// =======================================================================================
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://webersedigialifeapi:webersedigialifeapi@digialifeapipanel.5sgkx4e.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);



// ==========================

//   =================== create payment for services =========================
const services_create_payment = async (req, res) => {
  try {
    const { amount, partnerId, description } = req.body;
    // Create a Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency: "INR",
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);
    const user = await newuserSchema.findOne({ partnerId });
  console.log(">>>>>>>>>>>",user);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // Update the user's wallet_amount
  user.wallet_amount -= amount;

  // Save the updated user
  await user.save();
    // Create a Payment document in MongoDB
    const payment = new servicePaymentCreate({
      serviceId: new mongoose.Types.ObjectId(), // Generate a new ObjectId
      // serviceId:serviceId,
      partnerId: partnerId, // Use the partnerId string directly
      paymentId: order.id,
      amount: amount,
      description: description,
    });  
    // Save the Payment document and await the Promise
    const savedPayment = await payment.save();  
    res.status(200).json({
      message: "Payment success",
      payment: savedPayment,
      razorpayOrder: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const services_payment_success = async (req, res) => {
  try {
    const { paymentId, serviceOId } = req.body; // Destructure paymentId and serviceOId

    // Find the payment using the provided paymentId
    const payment = await servicePaymentCreate.findOne({ paymentId });  
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update the payment status to "confirmed"
    payment.status = 'confirmed';
    await payment.save();

    // Find the service order using the provided serviceOId
    const order = await serviceOrder.findById(serviceOId);

    if (!order) {
      return res.status(404).json({ error: 'Service order not found' });
    }
    // Update the service order status to 'success'
    order.status = 'sucess';
    await order.save();

    res.status(200).json({ message: 'Payment confirmed and service marked as successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};


// Function to create a Razorpay order
// const createRazorpayOrder = async (amount) => {
//   const options = {
//     amount: amount * 100, // Amount in paise (1 INR = 100 paise)
//     currency: 'INR',
//     receipt: 'order_rcptid_11',
//     payment_capture: 1, // Auto-capture payment
//   };

//   try {
//     const order = await razorpay.orders.create(options);
//     const payment = new order_ProductModel({
//       orderId: order.id
//     });
//    await payment.save(); 
//   } catch (error) {
//     throw error;
//   }
// }


// const razorpay_create_payment = async(req,res)=>{
//   try {
//     const { products } = req.body;

//     if (!products || products.length === 0) {
//       return res.status(400).json({ success: false, message: 'Products are required' });
//     }

//     let totalAmount = 0;
//     const productArray = [];

//     for (const product of products) {
//       if (!product.productId || !product.quantity) {
//         return res.status(400).json({ success: false, message: 'Each product must have a productId and quantity' });
//       }

//       // Replace this with your logic to fetch product price from the database
//       const productPrice = await fetchProductPrice(product.productId);

//       const totalPrice = productPrice * product.quantity;

//       totalAmount += totalPrice;

//       productArray.push({
//         productId: product.productId,
//         quantity: product.quantity,
//         totalPrice: totalPrice,
//       });
//     }
//     const razorpayOrder = await createRazorpayOrder(totalAmount); // Implement this function
//     console.log(razorpayOrder);
//     // return

//     const order = new order_ProductModel({
//       products: productArray,
//       totalAmount: totalAmount,
//     });
//     const newOrder = await order.save();
//     res.status(201).json({ success: true, data: newOrder, razorpayOrder });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Something went wrong' });
//   }
// }
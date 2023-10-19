const login = async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await newuserSchema.findOne({ email });
  
      if(user){
        res.send(user)
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
}

const sigh_in = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const user = await newuserSchema.findOne({ email: email });        
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
        }        
        // Use bcrypt.compare to compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
        }       
        
        // If the password is valid, you can generate a token (you'll need to implement this)
        // and send it as a response
        // You can use a library like jsonwebtoken to generate tokens.
        // Replace 'YOUR_SECRET_KEY' with your actual secret key.
        const token = jwt.sign({ email: user.email, name: user.name, _id: user._id }, 'YOUR_SECRET_KEY');
        
        return res.json({ token: token });
    } catch (error) {
        console.log(error, "Error during login.");
        res.status(500).send("Internal server error");
    }
}
// const login = (req, res) => {
//     const token = req.headers.token; // Assuming the token is sent in the "Authorization" header
//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized user!!' });
//     }
//     console.log(">>>>>>>>>>>>>>>>..",token);
//     // Verify and decode the token
//     jwt.verify(token, 'YOUR_SECRET_KEY', (err, newuserSchema) => {
//         if (err) {
//             console.log(err,">>>>>>>>>>>...");
//             return res.status(401).json({ message: 'Unauthorized user!!' });
//         }     
//      res.send(newuserSchema);

//         // The decoded object contains user information (e.g., email, name, _id)
//         // req.user = decoded;
//         // next();
//     });
// };
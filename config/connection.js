const mongoose = require('mongoose');
//  ================ Local mongoose connection String  ============================
// "mongodb://127.0.0.1:27017/demo"
// ================= Server connection String =====================================
// const uri = "mongodb+srv://webersedigialifeapi:webersedigialifeapi@digialifeapipanel.5sgkx4e.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect("mongodb://127.0.0.1:27017/demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);

  });

  module.exports = mongoose.Connection;


// =========================== local connection String ==============
// const mongoose = require('mongoose');

// mongoose.connect("mongodb://127.0.0.1:27017/demo", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.log(err);

//   });

//   module.exports = mongoose.Connection;
const express = require("express");
const app = express();
const PORT = 8000;

const Router = require("./route/router");
const kycRoute=require("./route/kycRoute");
const adminRoute=require("./route/adminRoute");
const BAgreement = require("./route/businessAgreementRoute");
const client_Send_data = require("./route/client_send_data");

require("./config/connection")
const cors = require("cors");
app.use(cors());
// app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(Router);
app.use(kycRoute);
app.use(adminRoute);
app.use(BAgreement);
app.use(client_Send_data);

app.listen(PORT,()=>{
    console.log("Server started on 8000");
})
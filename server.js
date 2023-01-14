const express=require("express")
const app=express();
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
require("dotenv").config();

//middleware
app.use(express.json());

//Database connection
connectDB();


app.listen(process.env.PORT || 8080, () => {
    console.log("Server is runnng at port", process.env.PORT);
});
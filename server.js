const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/user");

require("dotenv").config();

//middleware
app.use(express.json());

//Database connection
connectDB();
app.use("/api/v1/", userRoutes);

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is runnng at port", process.env.PORT);
});

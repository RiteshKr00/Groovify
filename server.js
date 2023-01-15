const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const userRoutes = require("./routes/user");
const songRoutes = require("./routes/track");
const spotifyRoutes = require("./routes/spotifyApi");
const playlistRoutes = require("./routes/playlist");

require("dotenv").config();

//middleware
app.use(express.json());

//Database connection
connectDB();
app.use("/api/v1/auth/", userRoutes);
app.use("/api/v1/song/", songRoutes);
app.use("/api/v1/song/spotify/", spotifyRoutes);
app.use("/api/v1/playlists/", playlistRoutes);

app.get("/ping", (req, res) => {
  return res.status(200).json({
    message: "Server is Live",
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Server is runnng at port", process.env.PORT);
});

const express = require("express");
const Track = require("../models/trackModel");
const isAuthenticated = require("../middlewares/authJwt");
const router = express.Router();

//Get all Songs
router.get("/allsong", isAuthenticated, async (req, res) => {
  try {
    const songs = await Track.find();
    if (!songs.length) res.status(404).json({ message: "No Song found" });

    res.status(200).json({ message: "success", Allsongs: songs });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//playlist of given category
router.get("/track/:songId", isAuthenticated, async (req, res) => {
  try {
    const songId = req.params.songId;
    const song = await Track.findById(songId);
    if (!song) res.status(404).json({ message: "No Song found with given Id" });

    res.status(200).json({ message: "success", song });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//search songs using query parameters
router.get("/search", isAuthenticated, async (req, res) => {
  try {
    let queryArray = [];
    if (req.query.trackName) {
      let query = {};
      query.trackName = { $regex: req.query.trackName, $options: "i" };
      queryArray.push(query);
    }
    if (req.query.artist) {
      let query = {};
      query.artistList = {
        $in: [req.query.artist],
      };
      queryArray.push(query);
    }
    if (req.query.albumName) {
      let query = {};
      query.albumName = { $regex: req.query.albumName, $options: "i" };
      queryArray.push(query);
    }
    console.log(queryArray);
    const songs = await Track.find({
      $or: queryArray,
    });
    res.status(200).json({ message: "success", songs });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});

module.exports = router;

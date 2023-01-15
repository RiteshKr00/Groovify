const express = require("express");
const router = express.Router();
const Track = require("../models/trackModel");
const Playlist = require("../models/playlistModel");
const isAuthenticated = require("../middlewares/authJwt");

//Create playlist
router.post("/", isAuthenticated, async (req, res) => {
  try {
    console.log(req.user);
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description required" });
    }
    const playlist = await new Playlist({
      name,
      description,
      createdBy: req.user._id,
    }).save();

    res.status(200).json({ message: "Playlist Created", playlist });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//Get all the playlist created by authenticated user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const { _id } = req.user;
    const myPlaylist = await Playlist.find({ createdBy: _id }).populate(
      "songs"
    );
    if (!myPlaylist.length) {
      return res.status(404).json({ message: "No Playlist Found" });
    }
    res.status(200).json({ message: "success", myPlaylist });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//Get  given playlist Id
router.get("/:playlistId", isAuthenticated, async (req, res) => {
  try {
    const playlist_id = req.params.playlistId;
    console.log(playlist_id);
    const playlist = await Playlist.findById(playlist_id).populate("songs");
    if (!playlist) {
      return res.status(404).json({ message: "No Playlist Found" });
    }
    res.status(200).json({ message: "success", playlist });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//Update Name and description of the given Id
router.put("/:playlistId", isAuthenticated, async (req, res) => {
  try {
    const playlist_id = req.params.playlistId;
    console.log(playlist_id);
    const updatedplaylist = await Playlist.findOneAndUpdate(
      { _id: playlist_id },
      req.body,
      { new: true }
    );
    if (!updatedplaylist)
      return res.status(404).json({ message: "Playlist Not Found" });

    res.status(200).json({ message: "Playlist Updated", updatedplaylist });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//delete a playlist with given Id
router.delete("/:playlistId", isAuthenticated, async (req, res) => {
  try {
    const playlist_id = req.params.playlistId;
    const deletedPlaylist = await Playlist.findOneAndDelete({
      _id: playlist_id,
    });
    if (!deletedPlaylist)
      return res
        .status(404)
        .json({ message: "Playlist to be deleted Not Found" });
    res
      .status(200)
      .json({ message: "Playlist Deleted", Deleted_playlist: deletedPlaylist });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//add songs to given playlist
router.post("/:playlistId/songs", isAuthenticated, async (req, res) => {
  try {
    const playlist_id = req.params.playlistId;
    const { song_id } = req.body;
    //check track exist or not
    const isTrackExist = await Track.findById(song_id);
    if (!isTrackExist)
      return res
        .status(404)
        .json({ message: "Song of given Id Does not exist" });
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlist_id,
      {
        $addToSet: { songs: song_id },
      },
      {
        new: true,
      }
    );

    if (!updatedPlaylist)
      return res
        .status(404)
        .json({ message: "Playlist Not Found to be Updated" });

    res.status(200).json({ message: "Playlist Updated", updatedPlaylist });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//remove songs from given playlist
router.delete("/:playlistId/songs", isAuthenticated, async (req, res) => {
  try {
    const playlist_id = req.params.playlistId;
    const { song_id } = req.body;
    //check track exist or not
    const isTrackExist = await Track.findById(song_id);
    if (!isTrackExist)
      return res
        .status(404)
        .json({ message: "Song of given Id Does not exist" });

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlist_id,
      {
        $pull: { songs: song_id },
      },
      {
        new: true,
      }
    );

    if (!updatedPlaylist)
      return res
        .status(404)
        .json({ message: "Playlist Not Found to be Updated" });

    res
      .status(200)
      .json({ message: "Song Deleted From Playlist", updatedPlaylist });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
module.exports = router;

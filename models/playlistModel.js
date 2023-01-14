const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  songs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Track",
  }] ,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Playlist = mongoose.model("Playlist", PlaylistSchema);

module.exports = Playlist;

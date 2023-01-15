const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
  trackId: {
    type: String,
    unique: true,
  },
  trackName: {
    type: String,
    required: true,
    unique: true,
  },
  albumName: {
    type: String,
    required: true,
  },
  artistList: [
    {
      type: String,
    },
  ],
  duration: {
    type: Number,
    required: true,
  },
  trackUrl: {
    type: String,
    required: true,
  },
});
const Track = mongoose.model("Track", TrackSchema);

module.exports = Track;

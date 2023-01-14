const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
  trackId: {
    type: String,
  },
  trackName: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  artistList: [
    {
      type: string,
    },
  ],
  duration: {
    type: Number,
    required: true,
  },
});
const Track = mongoose.model("Track", TrackSchema);

module.exports = Track;

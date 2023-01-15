const express = require("express");
const router = express.Router();
const { auth_token, token_url, data } = require("../utils/authorizeSpotify");
const { default: axios } = require("axios");
const Track = require("../models/trackModel");
const isAuthenticated = require("../middlewares/authJwt");

//These routes can be called by Admin to Update Database

const getAuth = async () => {
  try {
    //make post request to SPOTIFY API for access token, sending relavent info
    const response = await axios.post(token_url, data, {
      headers: {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    //return access token
    return response.data.access_token;
    //console.log(response.data.access_token);
  } catch (error) {
    //on fail, log the error in console
    console.log(error);
  }
};
//browse all categories
router.get("/browsesongs", isAuthenticated, async (req, res) => {
  try {
    const access_token = await getAuth();
    console.log(access_token);
    if (!access_token) {
      return res.status(400).json({ message: "Spotify auth failed" });
    }
    const response = await axios.get(
      "	https://api.spotify.com/v1/browse/categories",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log(response);
    const categoryList = response.data.categories.items;
    res.status(200).json({ message: "success", Catagories: categoryList });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//playlist of given category
router.get("/playlist/:categoryId", isAuthenticated, async (req, res) => {
  try {
    const category_id = req.params.categoryId;
    const access_token = await getAuth();
    console.log(access_token);
    if (!access_token) {
      return res.status(400).json({ message: "Spotify auth failed" });
    }
    const response = await axios.get(
      `https://api.spotify.com/v1/browse/categories/${category_id}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log(response);
    const playList = response.data.playlists.items;
    const playlistOfId = playList.map((item) => {
      return {
        name: item.name,
        id: item.id,
        description: item.description,
        tracksListUrl: item.tracks.href,
      };
    });
    res.status(200).json({ message: "success", playlistOfId });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//Get tracks of given playlist Id and add it to database
router.get("/tracks/:playlistId", isAuthenticated, async (req, res) => {
  try {
    const playlist_id = req.params.playlistId;
    const access_token = await getAuth();
    if (!access_token) {
      return res.status(400).json({ message: "Spotify auth failed" });
    }
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    // console.log(response);
    const playList = response.data.items;
    const playlistOfId = playList.map((item) => {
      const albumName = item.track.album.name;
      const artist = item.track.artists.map((art) => art.name);
      const duration = item.track.duration_ms;
      return {
        trackName: item.track.name,
        trackId: item.track.id,
        trackUrl: item.track.href,
        artistList: artist,
        duration,
        albumName,
      };
    });
    //adding to db using BulkWrite
    let operations = playlistOfId.map((track) => {
      return {
        insertOne: {
          document: track,
          upsert: true,
        },
      };
    });
    await Track.bulkWrite(operations, { ordered: false })
      .then((result) => {
        console.log(`Successfully inserted ${result.nInserted} documents`);
      })
      .catch((err) => {
        if (err.code === 11000) {
          console.log(err.writeErrors.length);
          console.log(
            err.writeErrors.length,
            "Duplicate trackName/trackId found . Rest songs are added"
          );
        } else {
          console.log("Error:", err.message);
        }
      });

    res.status(200).json({ message: "success", playlistOfId });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//get track details
router.get("/tracks/music/:trackId", isAuthenticated, async (req, res) => {
  try {
    const track_id = req.params.trackId;
    const access_token = await getAuth();
    console.log(access_token);
    if (!access_token) {
      return res.status(400).json({ message: "Spotify auth failed" });
    }
    const response = await axios.get(
      `https://api.spotify.com/v1/tracks/${track_id}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log(response);
    const item = response.data;
    const artist = item.artists.map((art) => art.name);
    const trackDetails = {
      name: item.name,
      id: item.id,
      trackUrl: item.href,
      preview_url: item.preview_url,
      artist,
      duration: item.duration_ms,
      albumName: item.album.name,
    };
    res.status(200).json({ message: "success", trackDetails });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//search songs
router.get("/search", isAuthenticated, async (req, res) => {
  try {
    const { query } = req.body;
    const { querytype } = req.body; //track or artist
    const access_token = await getAuth();
    if (!access_token) {
      return res.status(400).json({ message: "Spotify auth failed" });
    }
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${query}&type=${querytype}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const item = response.data;
    // const artist = item.artists.map((art) => art.name);
    // const trackDetails = {
    //   name: item.name,
    //   id: item.id,
    //   trackUrl: item.href,
    //   preview_url: item.preview_url,
    //   artist,
    //   duration: item.duration_ms,
    //   albumName: item.album.name,
    // };
    res.status(200).json({ message: "success", item });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
module.exports = router;

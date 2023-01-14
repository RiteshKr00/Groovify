const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const qs = require("qs");

const auth_token = Buffer.from(
  `${client_id}:${client_secret}`,
  "utf-8"
).toString("base64");
const token_url = "https://accounts.spotify.com/api/token";
const data = qs.stringify({ grant_type: "client_credentials" });

module.exports = { auth_token, token_url, data };

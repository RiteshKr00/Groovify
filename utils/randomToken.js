const Crypto = require("crypto");
module.exports = GeneraterandomString = (size = 22) => {
  return Crypto.randomBytes(size).toString("hex").slice(0, size);
};

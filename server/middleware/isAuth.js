const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../mongoDB/models/user");
const { createTokens } = require("../utils/CreateTokens");

module.exports = (req, res, next) => {
  const refreshToken = req.cookies["refresh-token"];
  const accessToken = req.cookies["access-token"];

  if (!refreshToken && !accessToken) {
    return next();
  }

  try {
    const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    req.userId = data.userId;
    return next();
  } catch {}

  if (!refreshToken) {
    return next();
  }

  let data;

  try {
    data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
  } catch {
    return next();
  }
  const user = User.findById(data.userId);

  if (!user || user.refreshVerify !== data.refreshVerify) {
    return next();
  }
  req.userId = user._id;
  return next();
};

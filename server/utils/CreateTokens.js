const jwt = require("jsonwebtoken");
require("dotenv").config();

const createAccessToken = (user) => {
  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "15s",
  });
  return accessToken;
};

const createRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { userId: user._id, refreshVerify: user.refreshVerify },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
  return refreshToken;
};

const createEmailResetToken = (user) => {
  const resetToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN, {
    expiresIn: "30min",
  });

  return resetToken;
};
module.exports = {
  createAccessToken,
  createRefreshToken,
  createEmailResetToken,
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

const createAccessToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "15m",
    }
  );
  return accessToken;
};

const createRefreshToken = (res, user) => {
  const refreshToken = jwt.sign(
    { userId: user.id, refreshTokenKey: user.refresh_token_key },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("refresh-token", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    // path: "/refresh_token",
  });
};

const createEmailResetToken = (user) => {
  const resetToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN, {
    expiresIn: "1d",
  });

  return resetToken;
};
module.exports = {
  createAccessToken,
  createRefreshToken,
  createEmailResetToken,
};

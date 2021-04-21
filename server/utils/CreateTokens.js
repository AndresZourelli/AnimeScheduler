const jwt = require("jsonwebtoken");
require("dotenv").config();

const createTokens = (user) => {
  const refreshToken = jwt.sign(
    { userId: user._id, refreshVerify: user.refreshVerify },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "15min",
  });

  return { refreshToken, accessToken };
};

const createEmailResetToken = (user) => {
  const resetToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN, {
    expiresIn: "30min",
  });

  return resetToken;
};
module.exports = { createTokens, createEmailResetToken };

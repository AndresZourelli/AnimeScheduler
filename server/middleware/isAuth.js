const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const accessToken = req?.headers?.authorization?.split(" ")[1];

  if (!accessToken) {
    return next();
  }

  try {
    const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    req.userId = data.userId;
    return next();
  } catch {
    return next();
  }
};

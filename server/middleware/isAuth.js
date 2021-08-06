const firebase = require("../lib/fb");
require("dotenv").config();

module.exports = (req, res, next) => {
  const accessToken = req?.headers?.authorization?.split(" ")[1];
  if (!accessToken) {
    return next();
  }

  try {
    const user = firebase.auth().verifyIdToken(accessToken);
    req.user.id = user.uid;
    req.user.role = user.claims.role;
    return next();
  } catch {
    return next();
  }
};

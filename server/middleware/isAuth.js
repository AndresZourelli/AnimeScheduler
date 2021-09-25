const firebase = require("../lib/fb");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const accessToken = req?.headers?.authorization?.split(" ")[1];
  if (accessToken == null || accessToken === undefined) {
    return next();
  }

  try {
    const user = await firebase.auth().verifyIdToken(accessToken);
    req.user = {};
    req.user.id = user.uid;
    req.user.role = user.role;
    return next();
  } catch (e) {
    console.log(e);
    return next();
  }
};

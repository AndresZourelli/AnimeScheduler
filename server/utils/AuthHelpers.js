const User = require("../db/models/users.model");
const fb = require("../lib/fb");

const addCustomClaims = async (req, res) => {
  const { idToken } = req.body;
  const claims = await fb.auth().verifyIdToken(idToken);
  if (typeof claims.email !== "undefined") {
    const { role } = await User.query().findById(claims.uid);
    await fb.auth().setCustomUserClaims(claims.uid, { role });
    res.json({ status: "success" });
  } else {
    res.json({ status: "ineligible" });
  }
};

module.exports = { addCustomClaims };

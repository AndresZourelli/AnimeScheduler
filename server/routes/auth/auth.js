const express = require("express");
const passport = require("passport");
const {
  localStrategyLogin,
  localStrategySignup,
} = require("../../middleware/passport");

const {
  createAccessToken,
  createRefreshToken,
} = require("../../utils/CreateTokens");

const router = express.Router();

passport.use("login", localStrategyLogin);

passport.use("signup", localStrategySignup);

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  (req, res) => res.json({ success: true })
);

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    createRefreshToken(res, req.user);
    const token = createAccessToken(req.user);
    return res.redirect(`/dashboard?token=${token}`);
  }
);

module.exports = router;

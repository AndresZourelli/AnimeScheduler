const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const axios = require("axios");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const User = require("../db/models/users.model");

module.exports = {
  // eslint-disable-next-line new-cap
  localStrategyLogin: new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { password2 } = req.body;
      try {
        const user = await User.query().where("email", "=", email);
        if (!user) {
          return done(null, false, {
            message: "Username or password incorrect",
          });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return done(null, false, {
            message: "Username or password incorrect",
          });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  ),
  // eslint-disable-next-line new-cap
  localStrategySignup: new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const { username } = req.body;
        const user = await User.query().insert({ email, password, username });
        if (!user) {
          return done(null, false, {
            message: "Username or password incorrect",
          });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return done(null, false, {
            message: "Username or password incorrect",
          });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  ),
  jwtStrategy: new JwtStrategy(
    {
      secretOrKey: process.env.ACCESS_TOKEN,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
    },
    async (token, done) => {
      try {
        return done(null, token);
      } catch (err) {
        return done(err);
      }
    }
  ),
};

const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const axios = require("axios");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const yup = require("yup");
const knex = require("knex");
const User = require("../db/models/users.model");
const { sendRegisterEmail } = require("../utils/SendEmails");

const registerUserValidationSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  passwordConfirmation: yup
    .string()
    .required()
    .test(
      "passwords-match",
      "Passwords must match",
      (value) => this.parent.password === value
    ),
});

const loginUserValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

module.exports = {
  // eslint-disable-next-line new-cap
  localStrategySignup: new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { passwordConfirmation, username } = req.body;

      try {
        await registerUserValidationSchema.validate(
          {
            username,
            email,
            password,
            passwordConfirmation,
          },
          { abortEarly: false }
        );

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.query()
          .insert({
            username,
            email,
            password: hashedPassword,
          })
          .returning(["verify_email_key", "id"]);

        if (!user) {
          return done(null, false, {
            message: "User already exists",
          });
        }

        await sendRegisterEmail(user.verify_email_key, email);

        return done(
          null,
          { userId: user.id },
          { message: "Register Successful" }
        );
      } catch (error) {
        return done(error);
      }
    }
  ),
  // eslint-disable-next-line new-cap
  localStrategyLogin: new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (req, email, password, done) => {
      try {
        await loginUserValidationSchema.validate(
          { email, password },
          { abortEarly: false }
        );
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

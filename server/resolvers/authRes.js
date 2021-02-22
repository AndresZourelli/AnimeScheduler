const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../mongoDB/models/user");
const CustomError = require("../lib/CustomErrors");
const { formatErrors } = require("../utils/FormatError");
require("dotenv").config();

const authResolver = {
  Query: {
    login: async (_, { email, password }, { res }) => {
      try {
        if (!email || !password) {
          throw new CustomError("loginCredentials", "Missing email/password");
        }
        const findUser = await User.findOne({ email });
        const pwMatch = await bcrypt.compare(password, findUser.password);

        if (pwMatch) {
          const refreshToken = jwt.sign(
            { id: findUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          const accessToken = jwt.sign(
            { id: findUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "15min" }
          );

          res.cookie("refresh-token", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });

          res.cookie("access-token", accessToken, { maxAge: 1000 * 60 * 15 });

          return {
            userId: findUser._id,
            success: true,
          };
        }
        throw new CustomError("loginCredentials", "Incorrect email/password");
      } catch (e) {
        return {
          userId: "Error",
          success: false,
          errors: formatErrors(e),
        };
      }
    },
    refreshToken: async (_, __, { res }) => {
      res.cookie("test", "Asdfasdf", {
        httpOnly: true,
      });
      return true;
    },
  },
};

module.exports = { authResolver };

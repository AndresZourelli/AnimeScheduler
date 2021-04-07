const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const User = require("../mongoDB/models/user");
const CustomError = require("../lib/CustomErrors");
const { formatErrors } = require("../utils/FormatError");
const { createTokens } = require("../utils/CreateTokens");
const { sendResetEmail } = require("../utils/SendEmails");
require("dotenv").config();

const authResolver = {
  Query: {
    login: async (_, { email, password }, { res }) => {
      try {
        if (!email || !password) {
          throw new CustomError("loginCredentials", "Missing email/password");
        }
        const findUser = await User.findOne({ email });
        if (!findUser) {
          throw new CustomError("invalidEmail", "Email not found");
        }
        const pwMatch = await bcrypt.compare(password, findUser.password);

        if (pwMatch) {
          const { refreshToken, accessToken } = createTokens(findUser);

          res.cookie("refresh-token", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          });

          res.cookie("access-token", accessToken, {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
          });

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
    verifyResetToken: async (_, { token }) => {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpires: {
          $gt: Date.now(),
        },
      });

      if (user === null) {
        return false;
      }

      return true;
    },
  },
  Mutation: {
    invalidateTokens: async (_, __, { req }) => {
      if (!req.userId) {
        return false;
      }
      const user = await User.findById(req.userId);
      user.refreshVerify = uuidv4();
      await user.save();
      return true;
    },
    generateResetToken: async (_, { user_id }) => {
      try {
        const user = await User.findById(user_id);
        if (user === null) {
          return false;
        }
        user.resetToken = uuidv4();
        user.resetTokenExpires = Date.now() + 60 * 1000 * 30;
        await user.save();
        await sendResetEmail(user.resetToken, user.email);
        return true;
      } catch (e) {
        return false;
      }
    },

    changePassword: async (_, { password, verifyPassword, token }) => {
      try {
        const user = await User.findOne({
          resetToken: token,
          resetTokenExpires: {
            $gt: Date.now(),
          },
        });

        if (user === null) {
          return {
            success: false,
            message: "Token Expired or Missing",
          };
        }

        if (password === verifyPassword) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
          return {
            success: true,
            message: "Password Successfully Changed",
          };
        }
      } catch (error) {
        return {
          success: false,
          message: "Token Expired or Missing",
        };
      }
      return {
        success: false,
        message: "Token Expired or Missing",
      };
    },
  },
};

module.exports = { authResolver };

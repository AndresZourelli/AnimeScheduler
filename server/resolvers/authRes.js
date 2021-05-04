const bcrypt = require("bcryptjs");

const { v4: uuidv4 } = require("uuid");
const User = require("../mongoDB/models/user");
const CustomError = require("../lib/CustomErrors");
const { formatErrors } = require("../utils/FormatError");
const {
  createAccessToken,
  createRefreshToken,
} = require("../utils/CreateTokens");
const { invalidateTokens } = require("../utils/AuthHelpers");
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
          findUser.refreshVerify = uuidv4();

          const refreshToken = createRefreshToken(findUser);
          const accessToken = createAccessToken(findUser);

          await User.findByIdAndUpdate(findUser._id, {
            refreshVerify: findUser.refreshVerify,
          });

          res.cookie("refresh-token", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            path: "/refresh_token",
          });

          return {
            userId: findUser._id,
            token: accessToken,
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
        resetEmailToken: token,
        resetEmailTokenExpires: {
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
    generateResetToken: async (_, { email }) => {
      try {
        const user = await User.findOne({ email });
        if (user === null) {
          return false;
        }
        user.resetEmailToken = uuidv4();
        user.resetEmailTokenExpires = Date.now() + 60 * 1000 * 30;
        await user.save();
        await sendResetEmail(user.resetEmailToken, user.email);
        await invalidateTokens(user._id);
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
          await user.save();
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
    logout: (_, __, { res }) => {
      res.cookie("refresh-token", "", {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        path: "/refresh_token",
      });
      return true;
    },
  },
};

module.exports = { authResolver };

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const User = require("../mongoDB/models/user");
const CustomError = require("../lib/CustomErrors");
const { formatErrors } = require("../utils/FormatError");
const {
  createAccessToken,
  createRefreshToken,
} = require("../utils/CreateTokens");
require("dotenv").config();

const userResolver = {
  Query: {
    getUser: async (_, { id }, { req: { userId } }) => {
      try {
        if (!id) {
          throw new CustomError("userId", "Missing User Id");
        }

        if (!userId || userId === "undefined") {
          throw new CustomError("authentication", "Authentication Error");
        }
        return await User.findById(userId.id);
      } catch (error) {
        return { errors: formatErrors(error), success: false };
      }
    },
    getUserAnimes: async (_, __, { req: { userId } }) => {
      if (!userId || userId === "undefined") {
        throw new CustomError("authentication", "Authentication Error");
      }

      try {
        const data = await User.findById(userId, "myAnimes").populate(
          "myAnimes",
          {
            title: 1,
            image_url: 1,
            _id: 1,
          }
        );
        return { success: true, animes: data.myAnimes };
      } catch (error) {
        return { errors: formatErrors(error), success: false };
      }
    },
  },
  Mutation: {
    createUser: async (
      _,
      { username, email, password, verifyPassword },
      { res }
    ) => {
      if (password !== verifyPassword) {
        return {
          success: false,
          errors: { type: "Password", message: "Passwords did not match" },
        };
      }
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createUser = new User({
          username,
          email,
          password: hashedPassword,
          refreshVerify: uuidv4(),
        });

        await createUser.save();

        const accessToken = createAccessToken(createUser);
        const refreshToken = createRefreshToken(createUser);

        res.cookie("refresh-token", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
          overwrite: true,
        });

        return {
          success: true,
          message: "New User Created!",
          user: { user_id: createUser._id },
          token: accessToken,
        };
      } catch (e) {
        return {
          success: false,
          errors: formatErrors(e),
        };
      }
    },
    addAnimeToUser: async (_, { animeId }, { req: { userId } }) => {
      try {
        if (!animeId) {
          throw new CustomError("userId", "Missing User Id");
        }
        if (!userId || userId === "undefined") {
          throw new CustomError("authentication", "Authentication Error");
        }
        const userInfo = await User.updateOne(
          { _id: userId, myAnimes: { $nin: [animeId] } },
          { $push: { myAnimes: [animeId] } }
        );
        if (userInfo.nModified === 0) {
          throw new CustomError("animeId", "Anime already added");
        }
        return { success: true };
      } catch (error) {
        return { errors: formatErrors(error), success: false };
      }
    },
  },
};

module.exports = { userResolver };

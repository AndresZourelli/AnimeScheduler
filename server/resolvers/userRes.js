const jwt = require("jsonwebtoken");
const User = require("../mongoDB/models/user");
const CustomError = require("../lib/CustomErrors");
const { formatErrors } = require("../utils/FormatError");
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
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      try {
        const createUser = new User({ username, email, password });

        await createUser.save();

        const token = jwt.sign(
          { user_id: createUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return {
          success: true,
          message: "New User Created!",
          user: { user_id: createUser._id },
          token,
        };
      } catch (e) {
        return {
          success: false,
          errors: formatErrors(e),
        };
      }
    },
  },
};

module.exports = { userResolver };

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
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
        const hashedPassword = await bcrypt.hash(password, 10);
        const createUser = new User({
          username,
          email,
          password: hashedPassword,
          refreshVerify: uuidv4(),
        });

        await createUser.save();

        return {
          success: true,
          message: "New User Created!",
          user: { user_id: createUser._id },
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

const User = require("../mongoDB/models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ValidationError = require("../lib/CustomErrors");
const { formatErrors } = require("../utils/FormatError");
require("dotenv").config();

const userResolver = {
  Query: {
    getUser: async (_, args, { user }) => {
      try {
        if (!user) {
          const new_error = new ValidationError(
            "authentication",
            "Authentication Error"
          );

          throw new_error;
        }
        return await User.findById(user.id);
      } catch (error) {
        return { message: formatErrors(error), success: false };
      }
    },
    userLogin: async (_, { email, password }) => {
      try {
        const findUser = await User.findOne({ email });
        const pwMatch = await bcrypt.compare(password, findUser.password);

        if (pwMatch) {
          const token = jwt.sign(
            { id: findUser._id, email: findUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );
          return {
            user: findUser,
            success: true,
            token,
          };
        } else {
          const new_error = new ValidationError(
            "password",
            "Incorrect password"
          );
          throw new_error;
        }
      } catch (e) {
        return {
          success: false,
          errors: formatErrors(e),
        };
      }
    },
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      try {
        const create_user = new User({ username, email, password });

        await create_user.save();

        const token = jwt.sign(
          { id: create_user._id, email: create_user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return {
          success: true,
          message: "New User Created!",
          user: { user_id: create_user._id },
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

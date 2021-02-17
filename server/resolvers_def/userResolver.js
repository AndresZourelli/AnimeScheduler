const User = require("../mongoDB/models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userResolver = {
  Query: {
    getUser: async (_, args, { user }) => {
      try {
        if (!user) {
          throw "Not Authenticated";
        }
        return await User.findById(user.id);
      } catch (error) {
        return { message: error };
      }
    },
    userLogin: async (_, args) => {
      try {
        const { email, password } = args.input;

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
          throw "Incorrect Password";
        }
      } catch (error) {
        return {
          success: false,
          errorMessage: error,
        };
      }
    },
  },
  Mutation: {
    createUser: async (_, args) => {
      try {
        let new_user = args.input;

        const hash = await bcrypt.hash(new_user.password, 10);
        new_user.password = hash;
        const create_user = new User(new_user);
        await create_user.save();

        const token = jwt.sign(
          { id: create_user._id, email: create_user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return {
          success: true,
          message: "New User Created!",
          user_id: create_user._id,
          token,
        };
      } catch (error) {
        return {
          success: false,
          message: error,
        };
      }
    },
  },
};

module.exports = { userResolver };

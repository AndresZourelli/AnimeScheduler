const { Schema, model } = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [isEmail, "Please Enter a Valid Email"],
      lowercase: true,
    },
    password: {
      type: String,
      require: [true, "Please Enter a Password"],
      minlength: [8, "Minimum password length is 8"],
      validate: [
        isStrongPassword,
        "Password must be at least 8 characters long, have at least 1 lowercase letter, 1 uppercase letter, and 1 symbol",
      ],
    },
    resetEmailToken: {
      type: String,
    },
    resetEmailTokenExpires: {
      type: Number,
    },
    myAnimes: [],
    refreshVerify: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const user = model("User", userSchema);

module.exports = user;

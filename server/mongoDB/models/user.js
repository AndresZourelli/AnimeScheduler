const { Schema, model } = require("mongoose");

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
    },
    password: { type: String, require: true },
    myAnimes: [],
  },
  { timestamps: true }
);

const user = model("User", userSchema);

module.exports = user;

const { Schema, model } = require("mongoose");

const characterSchema = new Schema(
  {
    name: String,
    image_url: String,
    role: String,
    animes: [],
    actors: [],
  },
  { timestamps: true }
);

const Character = model("Character", characterSchema);

module.exports = Character;

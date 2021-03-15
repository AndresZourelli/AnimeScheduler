const { Schema, model } = require("mongoose");

const actorSchema = new Schema(
  {
    name: String,
    image_url: String,
    actor_language: String,
    animes: [],
  },
  { timestamps: true }
);

const Actor = model("Actor", actorSchema);

module.exports = Actor;

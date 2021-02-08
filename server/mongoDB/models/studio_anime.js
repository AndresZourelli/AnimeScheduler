const { Schema, model } = require("mongoose");

const studioAnimeSchema = new Schema({
  anime_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  studio_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const studioAnime = model("StudioAnime", studioAnimeSchema);

module.exports = studioAnime;

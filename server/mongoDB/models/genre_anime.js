const { Schema, model } = require("mongoose");

const genreAnimeSchema = new Schema({
  anime_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  genre_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const genreAnime = model("GenreAnime", genreAnimeSchema);

module.exports = genreAnime;

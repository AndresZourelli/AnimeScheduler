const { Schema, model } = require("mongoose");

const genreSchema = new Schema({
  genre_name: {
    type: String,
    required: true,
  },
});

const genre = model("Genre", genreSchema);

module.exports = genre;

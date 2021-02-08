const { Schema, model } = require("mongoose");

const ratingSchema = new Schema({
  rating_name: {
    type: String,
    required: true,
  },
});

const rating = model("Rating", ratingSchema);

module.exports = rating;

const { Schema, model } = require("mongoose");

const animeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    avg_score: {
      type: Schema.Types.Decimal128,
      default: 0,
    },
    score: [{ user_id: Schema.Types.ObjectId, user_score: Number }],
    image_url: {
      type: String,
    },
    episodes: {
      type: Number,
    },
    aired_start: {
      type: String,
    },
    aired_end: {
      type: String,
    },
    broadcast_day: {
      type: String,
    },
    broadcast_time: {
      type: String,
    },
    duration: {
      type: String,
    },
    type: {
      type: String,
    },
    season: {
      type: String,
    },
    source: {
      type: String,
    },
    status: {
      type: String,
    },
    rating: {
      type: String,
    },
    alt_names: { type: Schema.Types.Mixed },
    genres: [],
    studios: [],
    producers: [],
    licensors: [],
  },
  { timestamps: true }
);

const Anime = model("Anime", animeSchema);

module.exports = Anime;

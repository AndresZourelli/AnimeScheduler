const { Schema, model } = require("mongoose");

const licensorAnimeSchema = new Schema({
  anime_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  licensor_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const licensorAnime = model("LicensorAnime", licensorAnimeSchema);

module.exports = licensorAnime;

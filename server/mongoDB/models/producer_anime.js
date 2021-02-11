const { Schema, model } = require("mongoose");

const producerAnimeSchema = new Schema({
  anime_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  producer_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const producerAnime = model("ProducerAnime", producerAnimeSchema);

module.exports = producerAnime;

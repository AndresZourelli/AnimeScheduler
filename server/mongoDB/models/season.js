const { Schema, model } = require("mongoose");

const seasonSchema = new Schema({
  season_name: {
    type: String,
    required: true,
  },
});

const season = model("Season", seasonSchema);

module.exports = season;

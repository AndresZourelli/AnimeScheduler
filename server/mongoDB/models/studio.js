const { Schema, model } = require("mongoose");

const studioSchema = new Schema({
  studio_name: {
    type: String,
    required: true,
  },
});

const studio = model("studio", studioSchema);

module.exports = studio;

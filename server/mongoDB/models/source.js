const { Schema, model } = require("mongoose");

const sourceSchema = new Schema({
  source_name: {
    type: String,
    required: true,
  },
});

const source = model("Source", sourceSchema);

module.exports = source;

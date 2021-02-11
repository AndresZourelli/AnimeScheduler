const { Schema, model } = require("mongoose");

const typeSchema = new Schema({
  type_name: { type: String, required: true },
});

const type = model("Type", typeSchema);

module.exports = type;

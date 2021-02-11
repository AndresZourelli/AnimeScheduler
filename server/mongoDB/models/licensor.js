const { Schema, model } = require("mongoose");

const licensorSchema = new Schema({
  licensor_name: {
    type: String,
    required: true,
  },
});

const licensor = model("licensor", licensorSchema);

module.exports = licensor;

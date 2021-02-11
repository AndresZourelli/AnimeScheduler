const { Schema, model } = require("mongoose");

const statusSchema = new Schema({
  status_name: {
    type: String,
    required: true,
  },
});

const status = model("Status", statusSchema);

module.exports = status;

const { Schema, model } = require("mongoose");

const producerSchema = new Schema({
  producer_name: {
    type: String,
    required: true,
  },
});

const producer = model("Producer", producerSchema);

module.exports = producer;

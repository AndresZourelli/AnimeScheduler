const { Schema, model } = require("mongoose");

const staffSchema = new Schema(
  {
    name: String,
    image_url: String,
    animes: [],
  },
  { timestamps: true }
);

const Staff = model("Staff", staffSchema);

module.exports = Staff;

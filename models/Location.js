const mongoose = require("mongoose");
const { Schema } = mongoose;

//Create Schema
const LocationSchema = new Schema({
  lon: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
});

module.exports = Location = mongoose.model("locations", LocationSchema);

const mongoose = require("mongoose");
const { Schema } = mongoose;

//Create Schema
const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = Category = mongoose.model("categories", CategorySchema);

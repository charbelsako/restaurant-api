const mongoose = require("mongoose");
const { Schema } = mongoose;

//Create Schema
const MenuItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    ref: "categories",
    type: Schema.Types.ObjectId,
  },
});

module.exports = MenuItem = mongoose.model("items", MenuItemSchema);

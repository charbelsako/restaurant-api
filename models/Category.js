const mongoose = require("mongoose")
const { Schema } = mongoose

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true },
  },
})

module.exports = Category = mongoose.model("categories", CategorySchema)

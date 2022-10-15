const mongoose = require('mongoose')
const { Schema } = mongoose

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
    ref: 'categories',
    type: Schema.Types.ObjectId,
  },
  ingredients: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ingredients',
    },
  ],
})

module.exports = MenuItem = mongoose.model('items', MenuItemSchema)

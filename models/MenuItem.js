const mongoose = require('mongoose')
const { Schema } = mongoose

const MenuItemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  image: String,
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  category: {
    ref: 'categories',
    type: Schema.Types.ObjectId,
    required: [true, 'Category is required'],
  },
  ingredients: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ingredients',
    },
  ],
})

module.exports = MenuItem = mongoose.model('items', MenuItemSchema)

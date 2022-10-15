const mongoose = require('mongoose')
const { Schema } = mongoose

const IngredientSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Ingredient must have a name'],
  },
})

module.exports = Ingredient = mongoose.model('ingredients', IngredientSchema)

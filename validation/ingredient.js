const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateIngredientInput(data) {
  let errors = {}

  data.name = !isEmpty(data.name) ? data.name : ''

  if (data.name !== '') {
    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
      errors.name = 'Name must be between 2 and 30 characters'
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}

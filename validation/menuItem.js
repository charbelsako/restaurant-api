const Validator = require("validator")
const isEmpty = require("./is-empty")

module.exports = function validateMenuItemInput(data) {
  let errors = {}
  data.name = !isEmpty(data.name) ? data.name : ""
  data.category = !isEmpty(data.category) ? data.category : ""

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters"
  }

  if (data.price <= 0) {
    errors.price = "Price must be greater than zero"
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}

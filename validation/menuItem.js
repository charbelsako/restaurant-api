const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateMenuItemInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.price = !isEmpty(data.price) ? data.price : "";
  data.category = !isEmpty(data.category) ? data.category : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (!Validator.isInt(data.price, { min: 250, max: 550000 })) {
    errors.price = "price must be an integer and can't be zero";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

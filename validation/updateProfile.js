const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (data.name !== "") {
    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
      errors.name = "Name must be between 2 and 30 characters";
    }
  }

  if (data.password !== "") {
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = "Password must be between 6 and 30 characters";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

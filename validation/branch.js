const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateBranchInput(data) {
  let errors = {};

  data.label = !isEmpty(data.label) ? data.label : "";
  data.lat = !isEmpty(data.lat) ? data.lat : "";
  data.lon = !isEmpty(data.lon) ? data.lon : "";

  if (!Validator.isFloat(data.lon)) {
    errors.lon = "Longitude has to be a float";
  }

  if (!Validator.isFloat(data.lon)) {
    errors.lat = "Latitude has to be a float";
  }

  if (data.label !== "") {
    if (!Validator.isLength(data.label, { min: 2, max: 30 })) {
      errors.label = "Label must be between 2 and 30 characters";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

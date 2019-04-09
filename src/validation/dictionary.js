import isEmpty from "./is-empty";
const Validator = require("validator");

export function validateAddDictionary(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";

  if (!Validator.isLength(data.name, { min: 1, max: 30 })) {
    errors.name = "Name must be between 1 and 30 characters!";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}
export function validateAddRow(data) {
  let errors = {};

  data.domain = !isEmpty(data.domain) ? data.domain : "";
  data.range = !isEmpty(data.range) ? data.range : "";

  if (!Validator.isLength(data.domain, { min: 1, max: 30 })) {
    errors.domain = "Domain must be between 1 and 30 characters!";
  }
  if (!Validator.isLength(data.range, { min: 1, max: 30 })) {
    errors.range = "Range must be between 1 and 30 characters!";
  }

  if (Validator.isEmpty(data.domain)) {
    errors.domain = "Domain field is required";
  }
  if (Validator.isEmpty(data.range)) {
    errors.range = "Range field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}

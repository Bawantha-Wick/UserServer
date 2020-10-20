const Joi = require("@hapi/joi");

// Validation for register
const registerValidation = (value) => {
  const validatingSchema = {
    userName: Joi.string().max(50).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
    address: Joi.string().max(255).required()
  };
  return Joi.validate(value, validatingSchema);
};

// Validation for login
const loginValidation = (value) => {
  const validatingSchema = {
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
  };
  return Joi.validate(value, validatingSchema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

const { body } = require("express-validator");

module.exports = {
  registerValidator: [
    body("name").notEmpty(),
    body("email").notEmpty().isEmail(),
    body("name").notEmpty(),
    body("gender").notEmpty(),
    body("phone").notEmpty(),
  ],
};

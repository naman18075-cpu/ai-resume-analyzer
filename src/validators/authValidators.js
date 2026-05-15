const { body } = require("express-validator");
const { USER_ROLES } = require("../utils/constants");

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .isIn(Object.values(USER_ROLES))
    .withMessage("Role must be CLIENT or FREELANCER"),
  body("city").trim().notEmpty().withMessage("City is required"),
  body("isVerified").optional().isBoolean().withMessage("isVerified must be a boolean")
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required")
];

module.exports = {
  registerValidation,
  loginValidation
};

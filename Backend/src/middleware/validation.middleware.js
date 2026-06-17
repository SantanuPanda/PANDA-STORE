const { body, validationResult } = require("express-validator");

async function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}


const validateRegistration = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .trim(),

  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long")
    .trim(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validate,
];

const validateLogin = [
  body("email")
    .matches(emailRegex)
    .withMessage("Please enter a valid email address")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

module.exports = { validateRegistration, validateLogin };

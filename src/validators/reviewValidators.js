const { body } = require("express-validator");

const createReviewValidation = [
  body("jobId").isUUID().withMessage("A valid jobId is required"),
  body("revieweeId").isUUID().withMessage("A valid revieweeId is required"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("rating must be between 1 and 5"),
  body("comment")
    .trim()
    .isLength({ min: 5 })
    .withMessage("comment must be at least 5 characters long")
];

module.exports = {
  createReviewValidation
};

const { body, param } = require("express-validator");

const fundMilestoneValidation = [
  param("id").isUUID().withMessage("A valid milestone id is required"),
  body("currency").optional().trim(),
  body("provider").optional().trim(),
  body("transactionReference").optional().trim(),
  body("notes").optional().trim()
];

const releaseMilestoneValidation = [
  param("id").isUUID().withMessage("A valid milestone id is required")
];

module.exports = {
  fundMilestoneValidation,
  releaseMilestoneValidation
};

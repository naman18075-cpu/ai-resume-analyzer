const { body, param } = require("express-validator");

const contractIdValidation = [
  param("id").isUUID().withMessage("A valid contract id is required")
];

const createMilestoneValidation = [
  param("id").isUUID().withMessage("A valid contract id is required"),
  body("title").trim().notEmpty().withMessage("title is required"),
  body("description").optional().trim(),
  body("amount").isFloat({ min: 0 }).withMessage("amount must be a positive number"),
  body("dueDate").optional().isISO8601().withMessage("dueDate must be a valid date")
];

const milestoneIdValidation = [
  param("id").isUUID().withMessage("A valid milestone id is required")
];

module.exports = {
  contractIdValidation,
  createMilestoneValidation,
  milestoneIdValidation
};

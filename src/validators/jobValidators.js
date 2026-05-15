const { body, param, query } = require("express-validator");
const { JOB_STATUSES } = require("../utils/constants");

const createJobValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("budgetMin").isFloat({ min: 0 }).withMessage("budgetMin must be a positive number"),
  body("budgetMax").isFloat({ min: 0 }).withMessage("budgetMax must be a positive number"),
  body("deadline").isISO8601().withMessage("Deadline must be a valid date"),
  body("skillsRequired")
    .isArray({ min: 1 })
    .withMessage("skillsRequired must be an array with at least one skill"),
  body("skillsRequired.*").trim().notEmpty().withMessage("Each skill must be a non-empty string"),
  body("locationPreference").trim().notEmpty().withMessage("locationPreference is required")
];

const listJobsValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
  query("minBudget").optional().isFloat({ min: 0 }).withMessage("minBudget must be a positive number"),
  query("maxBudget").optional().isFloat({ min: 0 }).withMessage("maxBudget must be a positive number"),
  query("city").optional().trim(),
  query("skill").optional().trim(),
  query("status")
    .optional()
    .isIn(Object.values(JOB_STATUSES))
    .withMessage("status must be OPEN, IN_PROGRESS, or COMPLETED")
];

const jobIdValidation = [
  param("id").isUUID().withMessage("A valid job id is required")
];

const clientJobValidation = [
  param("clientId").isUUID().withMessage("A valid client id is required"),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100")
];

module.exports = {
  createJobValidation,
  listJobsValidation,
  jobIdValidation,
  clientJobValidation
};

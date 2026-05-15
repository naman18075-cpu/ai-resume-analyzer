const { body, param, query } = require("express-validator");

const createBidValidation = [
  body("jobId").isUUID().withMessage("A valid jobId is required"),
  body("price").isFloat({ min: 0 }).withMessage("price must be a positive number"),
  body("proposalText")
    .trim()
    .isLength({ min: 20 })
    .withMessage("proposalText must be at least 20 characters long"),
  body("estimatedTime").trim().notEmpty().withMessage("estimatedTime is required"),
  body("matchScore")
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage("matchScore must be between 0 and 1")
];

const jobBidListValidation = [
  param("jobId").isUUID().withMessage("A valid job id is required"),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100")
];

const myBidListValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100")
];

const bidIdValidation = [
  param("id").isUUID().withMessage("A valid bid id is required")
];

module.exports = {
  createBidValidation,
  jobBidListValidation,
  myBidListValidation,
  bidIdValidation
};

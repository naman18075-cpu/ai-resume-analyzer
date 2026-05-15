const { body, param } = require("express-validator");

const createPortfolioItemValidation = [
  body("title").trim().notEmpty().withMessage("title is required"),
  body("description").trim().notEmpty().withMessage("description is required"),
  body("projectUrl").optional().isURL().withMessage("projectUrl must be a valid URL"),
  body("imageUrl").optional().isURL().withMessage("imageUrl must be a valid URL"),
  body("skills").optional().isArray().withMessage("skills must be an array"),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be a boolean")
];

const updatePortfolioItemValidation = [
  param("id").isUUID().withMessage("A valid portfolio item id is required"),
  body("title").optional().trim().notEmpty().withMessage("title cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("description cannot be empty"),
  body("projectUrl").optional().isURL().withMessage("projectUrl must be a valid URL"),
  body("imageUrl").optional().isURL().withMessage("imageUrl must be a valid URL"),
  body("skills").optional().isArray().withMessage("skills must be an array"),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be a boolean")
];

const freelancerPortfolioValidation = [
  param("freelancerId").isUUID().withMessage("A valid freelancer id is required")
];

module.exports = {
  createPortfolioItemValidation,
  updatePortfolioItemValidation,
  freelancerPortfolioValidation
};

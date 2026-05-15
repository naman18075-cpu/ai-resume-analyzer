const { body, query } = require("express-validator");

const uploadFileValidation = [
  body("fileName").trim().notEmpty().withMessage("fileName is required"),
  body("mimeType").trim().notEmpty().withMessage("mimeType is required"),
  body("base64Data").trim().notEmpty().withMessage("base64Data is required"),
  body("category").optional().trim(),
  body("entityType").optional().trim(),
  body("entityId").optional().trim()
];

const listFilesValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100")
];

module.exports = {
  uploadFileValidation,
  listFilesValidation
};

const { body, param } = require("express-validator");

const createConversationValidation = [
  body("subject").optional().trim(),
  body("clientId").optional().isUUID().withMessage("clientId must be a valid UUID"),
  body("freelancerId").optional().isUUID().withMessage("freelancerId must be a valid UUID"),
  body("jobId").optional().isUUID().withMessage("jobId must be a valid UUID"),
  body("contractId").optional().isUUID().withMessage("contractId must be a valid UUID")
];

const conversationIdValidation = [
  param("id").isUUID().withMessage("A valid conversation id is required")
];

const sendMessageValidation = [
  param("id").isUUID().withMessage("A valid conversation id is required"),
  body("body").trim().notEmpty().withMessage("body is required"),
  body("fileAssetId").optional().isUUID().withMessage("fileAssetId must be a valid UUID")
];

module.exports = {
  createConversationValidation,
  conversationIdValidation,
  sendMessageValidation
};

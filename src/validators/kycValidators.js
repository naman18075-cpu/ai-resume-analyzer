const { body, param } = require("express-validator");
const { KYC_STATUSES } = require("../utils/constants");

const submitKycValidation = [
  body("panNumber")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
    .withMessage("PAN number must follow the ABCDE1234F format"),
  body("fullName").trim().notEmpty().withMessage("fullName is required"),
  body("age").isInt({ min: 18 }).withMessage("age must be at least 18"),
  body("legalAddress").optional().trim(),
  body("notes").optional().trim(),
  body("documentFileId").optional().isUUID().withMessage("documentFileId must be a valid UUID")
];

const reviewKycValidation = [
  param("id").isUUID().withMessage("A valid KYC id is required"),
  body("status")
    .isIn([KYC_STATUSES.APPROVED, KYC_STATUSES.REJECTED])
    .withMessage("status must be APPROVED or REJECTED"),
  body("rejectionReason").optional().trim()
];

module.exports = {
  submitKycValidation,
  reviewKycValidation
};

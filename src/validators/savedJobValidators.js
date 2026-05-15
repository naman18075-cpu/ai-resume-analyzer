const { body, param } = require("express-validator");

const saveJobValidation = [
  body("jobId").isUUID().withMessage("A valid jobId is required")
];

const removeSavedJobValidation = [
  param("jobId").isUUID().withMessage("A valid job id is required")
];

module.exports = {
  saveJobValidation,
  removeSavedJobValidation
};

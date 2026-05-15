const express = require("express");
const kycController = require("../controllers/kycController");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdminAccess } = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { submitKycValidation, reviewKycValidation } = require("../validators/kycValidators");

const router = express.Router();

router.get("/me", protect, kycController.getMyKyc);
router.post("/submit", protect, submitKycValidation, validate, kycController.submitKyc);
router.patch("/:id/review", protect, requireAdminAccess, reviewKycValidation, validate, kycController.reviewKyc);

module.exports = router;

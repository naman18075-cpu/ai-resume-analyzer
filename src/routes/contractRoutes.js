const express = require("express");
const contractController = require("../controllers/contractController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { contractIdValidation, createMilestoneValidation, milestoneIdValidation } = require("../validators/contractValidators");

const router = express.Router();

router.get("/", protect, contractController.getMyContracts);
router.get("/:id", protect, contractIdValidation, validate, contractController.getContractById);
router.post("/:id/milestones", protect, createMilestoneValidation, validate, contractController.createMilestone);
router.patch("/milestones/:id/submit", protect, milestoneIdValidation, validate, contractController.submitMilestone);
router.patch("/milestones/:id/approve", protect, milestoneIdValidation, validate, contractController.approveMilestone);

module.exports = router;

const express = require("express");
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { fundMilestoneValidation, releaseMilestoneValidation } = require("../validators/paymentValidators");

const router = express.Router();

router.get("/", protect, paymentController.getMyPayments);
router.post("/milestones/:id/fund", protect, fundMilestoneValidation, validate, paymentController.fundMilestone);
router.patch("/milestones/:id/release", protect, releaseMilestoneValidation, validate, paymentController.releaseMilestonePayment);

module.exports = router;

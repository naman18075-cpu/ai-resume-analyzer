const express = require("express");
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { createReviewValidation } = require("../validators/reviewValidators");

const router = express.Router();

router.post("/", protect, createReviewValidation, validate, reviewController.createReview);

module.exports = router;

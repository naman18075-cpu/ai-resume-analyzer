const express = require("express");
const bidController = require("../controllers/bidController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { bidIdValidation, createBidValidation, jobBidListValidation, myBidListValidation } = require("../validators/bidValidators");
const { USER_ROLES } = require("../utils/constants");

const router = express.Router();

router.post("/", protect, allowRoles(USER_ROLES.FREELANCER), createBidValidation, validate, bidController.createBid);
router.get("/my-bids", protect, allowRoles(USER_ROLES.FREELANCER), myBidListValidation, validate, bidController.getMyBids);
router.get("/job/:jobId", protect, allowRoles(USER_ROLES.CLIENT), jobBidListValidation, validate, bidController.getBidsForJob);
router.patch("/:id/accept", protect, allowRoles(USER_ROLES.CLIENT), bidIdValidation, validate, bidController.acceptBid);
router.patch("/:id/reject", protect, allowRoles(USER_ROLES.CLIENT), bidIdValidation, validate, bidController.rejectBid);

module.exports = router;

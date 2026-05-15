const express = require("express");
const jobController = require("../controllers/jobController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { clientJobValidation, createJobValidation, jobIdValidation, listJobsValidation } = require("../validators/jobValidators");
const { USER_ROLES } = require("../utils/constants");

const router = express.Router();

router.get("/", listJobsValidation, validate, jobController.getJobs);
router.get("/my-jobs", protect, allowRoles(USER_ROLES.CLIENT), listJobsValidation, validate, jobController.getMyJobs);
router.get("/client/:clientId", clientJobValidation, validate, jobController.getJobsByClient);
router.get("/:id", jobIdValidation, validate, jobController.getSingleJob);
router.post("/", protect, allowRoles(USER_ROLES.CLIENT), createJobValidation, validate, jobController.createJob);
router.patch("/:id/complete", protect, allowRoles(USER_ROLES.CLIENT), jobIdValidation, validate, jobController.markJobCompleted);

module.exports = router;

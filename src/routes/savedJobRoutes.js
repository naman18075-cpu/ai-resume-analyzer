const express = require("express");
const savedJobController = require("../controllers/savedJobController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { saveJobValidation, removeSavedJobValidation } = require("../validators/savedJobValidators");
const { USER_ROLES } = require("../utils/constants");

const router = express.Router();

router.get("/", protect, allowRoles(USER_ROLES.FREELANCER), savedJobController.getSavedJobs);
router.post("/", protect, allowRoles(USER_ROLES.FREELANCER), saveJobValidation, validate, savedJobController.saveJob);
router.delete("/:jobId", protect, allowRoles(USER_ROLES.FREELANCER), removeSavedJobValidation, validate, savedJobController.removeSavedJob);

module.exports = router;

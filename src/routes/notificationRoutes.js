const express = require("express");
const notificationController = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { listNotificationsValidation, notificationIdValidation } = require("../validators/notificationValidators");

const router = express.Router();

router.get("/", protect, listNotificationsValidation, validate, notificationController.getMyNotifications);
router.patch("/read-all", protect, notificationController.markAllNotificationsRead);
router.patch("/:id/read", protect, notificationIdValidation, validate, notificationController.markNotificationRead);

module.exports = router;

const express = require("express");
const adminController = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { requireAdminAccess } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/stats", protect, requireAdminAccess, adminController.getPlatformStats);

module.exports = router;

const express = require("express");
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { loginValidation, registerValidation } = require("../validators/authValidators");

const router = express.Router();

router.post("/register", registerValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);
router.get("/me", protect, authController.getCurrentUser);

module.exports = router;

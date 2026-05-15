const express = require("express");
const fileController = require("../controllers/fileController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { uploadFileValidation, listFilesValidation } = require("../validators/fileValidators");

const router = express.Router();

router.get("/", protect, listFilesValidation, validate, fileController.getMyFiles);
router.post("/upload", protect, uploadFileValidation, validate, fileController.uploadFile);

module.exports = router;

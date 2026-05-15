const express = require("express");
const messageController = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { conversationIdValidation, createConversationValidation, sendMessageValidation } = require("../validators/messageValidators");

const router = express.Router();

router.get("/conversations", protect, messageController.getMyConversations);
router.post("/conversations", protect, createConversationValidation, validate, messageController.createConversation);
router.get("/conversations/:id/messages", protect, conversationIdValidation, validate, messageController.getConversationMessages);
router.post("/conversations/:id/messages", protect, sendMessageValidation, validate, messageController.sendMessage);
router.patch("/conversations/:id/read", protect, conversationIdValidation, validate, messageController.markConversationRead);

module.exports = router;

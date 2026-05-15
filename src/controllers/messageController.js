const { Op } = require("sequelize");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { Conversation, Message, User, Job, Contract, FileAsset } = require("../models");
const { MESSAGE_TYPES, NOTIFICATION_TYPES } = require("../utils/constants");
const { createNotification } = require("../utils/notifications");

const getParticipantIds = (req) => {
  if (req.user.role === "CLIENT") {
    return {
      clientId: req.user.id,
      freelancerId: req.body.freelancerId
    };
  }

  return {
    clientId: req.body.clientId,
    freelancerId: req.user.id
  };
};

const createConversation = asyncHandler(async (req, res) => {
  const { subject, jobId, contractId } = req.body;
  const { clientId, freelancerId } = getParticipantIds(req);

  if (!clientId || !freelancerId) {
    throw new ApiError(400, "Both client and freelancer participants are required");
  }

  if (jobId) {
    const job = await Job.findByPk(jobId);

    if (!job) {
      throw new ApiError(404, "Job not found");
    }
  }

  if (contractId) {
    const contract = await Contract.findByPk(contractId);

    if (!contract) {
      throw new ApiError(404, "Contract not found");
    }
  }

  let conversation = await Conversation.findOne({
    where: {
      clientId,
      freelancerId,
      jobId: jobId || null,
      contractId: contractId || null
    }
  });

  if (!conversation) {
    conversation = await Conversation.create({
      subject:
        subject ||
        (jobId ? "Job conversation" : contractId ? "Contract conversation" : "Direct conversation"),
      clientId,
      freelancerId,
      jobId: jobId || null,
      contractId: contractId || null
    });
  }

  res.status(201).json({
    success: true,
    data: conversation
  });
});

const getMyConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.findAll({
    where: {
      [Op.or]: [{ clientId: req.user.id }, { freelancerId: req.user.id }]
    },
    include: [
      {
        model: User,
        as: "client",
        attributes: ["id", "name", "email", "avatarUrl"]
      },
      {
        model: User,
        as: "freelancer",
        attributes: ["id", "name", "email", "avatarUrl"]
      },
      {
        model: Job,
        as: "job",
        attributes: ["id", "title", "status"]
      },
      {
        model: Contract,
        as: "contract",
        attributes: ["id", "title", "status"]
      }
    ],
    order: [["lastMessageAt", "DESC"], ["updatedAt", "DESC"]]
  });

  res.json({
    success: true,
    data: conversations
  });
});

const getConversationMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findByPk(req.params.id);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (![conversation.clientId, conversation.freelancerId].includes(req.user.id)) {
    throw new ApiError(403, "You do not have access to this conversation");
  }

  const messages = await Message.findAll({
    where: {
      conversationId: conversation.id
    },
    include: [
      {
        model: User,
        as: "sender",
        attributes: ["id", "name", "avatarUrl"]
      },
      {
        model: User,
        as: "receiver",
        attributes: ["id", "name", "avatarUrl"]
      },
      {
        model: FileAsset,
        as: "fileAsset"
      }
    ],
    order: [["createdAt", "ASC"]]
  });

  res.json({
    success: true,
    data: messages
  });
});

const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findByPk(req.params.id);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (![conversation.clientId, conversation.freelancerId].includes(req.user.id)) {
    throw new ApiError(403, "You do not have access to this conversation");
  }

  const receiverId = req.user.id === conversation.clientId ? conversation.freelancerId : conversation.clientId;

  let fileAssetId = req.body.fileAssetId || null;
  if (fileAssetId) {
    const fileAsset = await FileAsset.findOne({
      where: {
        id: fileAssetId,
        ownerId: req.user.id
      }
    });

    if (!fileAsset) {
      throw new ApiError(404, "Attached file not found");
    }
  }

  const message = await Message.create({
    conversationId: conversation.id,
    senderId: req.user.id,
    receiverId,
    body: req.body.body,
    messageType: fileAssetId ? MESSAGE_TYPES.FILE : MESSAGE_TYPES.TEXT,
    fileAssetId
  });

  await conversation.update({
    lastMessageAt: new Date()
  });

  await createNotification({
    recipientId: receiverId,
    title: "New message",
    body: "You received a new conversation message.",
    type: NOTIFICATION_TYPES.MESSAGE_RECEIVED,
    entityType: "Conversation",
    entityId: conversation.id
  });

  res.status(201).json({
    success: true,
    data: message
  });
});

const markConversationRead = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findByPk(req.params.id);

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  if (![conversation.clientId, conversation.freelancerId].includes(req.user.id)) {
    throw new ApiError(403, "You do not have access to this conversation");
  }

  await Message.update(
    {
      isRead: true,
      readAt: new Date()
    },
    {
      where: {
        conversationId: conversation.id,
        receiverId: req.user.id,
        isRead: false
      }
    }
  );

  res.json({
    success: true,
    message: "Conversation marked as read"
  });
});

module.exports = {
  createConversation,
  getMyConversations,
  getConversationMessages,
  sendMessage,
  markConversationRead
};

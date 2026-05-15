const asyncHandler = require("../utils/asyncHandler");
const { Notification } = require("../models");
const ApiError = require("../utils/apiError");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

const getMyNotifications = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await Notification.findAndCountAll({
    where: {
      recipientId: req.user.id
    },
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });

  res.json({
    success: true,
    data: rows,
    pagination: buildPaginationMeta(page, limit, count)
  });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    where: {
      id: req.params.id,
      recipientId: req.user.id
    }
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  await notification.update({
    isRead: true,
    readAt: new Date()
  });

  res.json({
    success: true,
    data: notification
  });
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.update(
    {
      isRead: true,
      readAt: new Date()
    },
    {
      where: {
        recipientId: req.user.id,
        isRead: false
      }
    }
  );

  res.json({
    success: true,
    message: "All notifications marked as read"
  });
});

module.exports = {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead
};

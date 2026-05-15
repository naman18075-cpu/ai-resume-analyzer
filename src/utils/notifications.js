const { Notification } = require("../models");

const createNotification = async ({
  recipientId,
  title,
  body,
  type,
  entityType = null,
  entityId = null
}) =>
  Notification.create({
    recipientId,
    title,
    body,
    type,
    entityType,
    entityId
  });

module.exports = {
  createNotification
};

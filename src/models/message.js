const { DataTypes, Model } = require("sequelize");
const { MESSAGE_TYPES } = require("../utils/constants");

module.exports = (sequelize) => {
  class Message extends Model {}

  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      messageType: {
        type: DataTypes.ENUM(...Object.values(MESSAGE_TYPES)),
        allowNull: false,
        defaultValue: MESSAGE_TYPES.TEXT
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      timestamps: true
    }
  );

  return Message;
};

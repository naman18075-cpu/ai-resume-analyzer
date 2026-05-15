const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Notification extends Model {}

  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      entityId: {
        type: DataTypes.STRING,
        allowNull: true
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
      modelName: "Notification",
      tableName: "notifications",
      timestamps: true
    }
  );

  return Notification;
};

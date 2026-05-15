const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Conversation extends Model {}

  Conversation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastMessageAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Conversation",
      tableName: "conversations",
      timestamps: true
    }
  );

  return Conversation;
};

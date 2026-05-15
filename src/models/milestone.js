const { DataTypes, Model } = require("sequelize");
const { MILESTONE_STATUSES } = require("../utils/constants");

module.exports = (sequelize) => {
  class Milestone extends Model {}

  Milestone.init(
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      sequence: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      status: {
        type: DataTypes.ENUM(...Object.values(MILESTONE_STATUSES)),
        allowNull: false,
        defaultValue: MILESTONE_STATUSES.PENDING
      }
    },
    {
      sequelize,
      modelName: "Milestone",
      tableName: "milestones",
      timestamps: true
    }
  );

  return Milestone;
};

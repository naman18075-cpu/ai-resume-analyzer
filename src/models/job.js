const { DataTypes, Model } = require("sequelize");
const { JOB_STATUSES } = require("../utils/constants");

module.exports = (sequelize) => {
  class Job extends Model {}

  Job.init(
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
        allowNull: false
      },
      budgetMin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      budgetMax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      deadline: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      skillsRequired: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
      },
      locationPreference: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(...Object.values(JOB_STATUSES)),
        defaultValue: JOB_STATUSES.OPEN
      }
    },
    {
      sequelize,
      modelName: "Job",
      tableName: "jobs",
      timestamps: true
    }
  );

  return Job;
};

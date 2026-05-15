const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class SavedJob extends Model {}

  SavedJob.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      }
    },
    {
      sequelize,
      modelName: "SavedJob",
      tableName: "saved_jobs",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId", "jobId"]
        }
      ]
    }
  );

  return SavedJob;
};

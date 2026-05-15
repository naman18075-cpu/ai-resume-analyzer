const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class FileAsset extends Model {}

  FileAsset.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      originalName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      storedName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      relativePath: {
        type: DataTypes.STRING,
        allowNull: false
      },
      publicUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true
      },
      entityType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      entityId: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "FileAsset",
      tableName: "file_assets",
      timestamps: true
    }
  );

  return FileAsset;
};

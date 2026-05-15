const { DataTypes, Model } = require("sequelize");
const { CONTRACT_STATUSES } = require("../utils/constants");

module.exports = (sequelize) => {
  class Contract extends Model {}

  Contract.init(
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
      scope: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      terms: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM(...Object.values(CONTRACT_STATUSES)),
        allowNull: false,
        defaultValue: CONTRACT_STATUSES.ACTIVE
      }
    },
    {
      sequelize,
      modelName: "Contract",
      tableName: "contracts",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["jobId"]
        },
        {
          unique: true,
          fields: ["bidId"]
        }
      ]
    }
  );

  return Contract;
};

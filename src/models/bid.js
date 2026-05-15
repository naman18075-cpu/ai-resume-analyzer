const { DataTypes, Model } = require("sequelize");
const { BID_STATUSES } = require("../utils/constants");

module.exports = (sequelize) => {
  class Bid extends Model {}

  Bid.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      proposalText: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      estimatedTime: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM(...Object.values(BID_STATUSES)),
        defaultValue: BID_STATUSES.PENDING
      },
      matchScore: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: "Bid",
      tableName: "bids",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["jobId", "freelancerId"]
        }
      ]
    }
  );

  return Bid;
};

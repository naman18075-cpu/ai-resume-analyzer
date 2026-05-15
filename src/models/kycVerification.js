const { DataTypes, Model } = require("sequelize");
const { KYC_STATUSES } = require("../utils/constants");

module.exports = (sequelize) => {
  class KycVerification extends Model {}

  KycVerification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      panNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      legalAddress: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM(...Object.values(KYC_STATUSES)),
        allowNull: false,
        defaultValue: KYC_STATUSES.PENDING
      },
      submittedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "KycVerification",
      tableName: "kyc_verifications",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId"]
        }
      ]
    }
  );

  return KycVerification;
};

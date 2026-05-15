const { DataTypes, Model } = require("sequelize");
const { PAYMENT_STATUSES } = require("../utils/constants");

module.exports = (sequelize) => {
  class Payment extends Model {}

  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "INR"
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "MANUAL_ESCROW"
      },
      transactionReference: {
        type: DataTypes.STRING,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM(...Object.values(PAYMENT_STATUSES)),
        allowNull: false,
        defaultValue: PAYMENT_STATUSES.INITIATED
      }
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments",
      timestamps: true
    }
  );

  return Payment;
};

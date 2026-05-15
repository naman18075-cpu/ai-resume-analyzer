const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Review extends Model {}

  Review.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "reviews",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["jobId", "reviewerId", "revieweeId"]
        }
      ]
    }
  );

  return Review;
};

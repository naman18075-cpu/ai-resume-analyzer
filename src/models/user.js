const bcrypt = require("bcryptjs");
const { DataTypes, Model } = require("sequelize");
const { USER_ROLES } = require("../utils/constants");

module.exports = (sequelize) => {
  class User extends Model {
    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        },
        set(value) {
          this.setDataValue("email", value.toLowerCase());
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM(...Object.values(USER_ROLES)),
        allowNull: false
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      completedJobs: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      defaultScope: {
        attributes: {
          exclude: ["password"]
        }
      },
      hooks: {
        async beforeCreate(user) {
          user.password = await bcrypt.hash(user.password, 10);
        },
        async beforeUpdate(user) {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        }
      }
    }
  );

  return User;
};

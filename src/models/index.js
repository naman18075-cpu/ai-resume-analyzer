const sequelize = require("../config/database");
const User = require("./user")(sequelize);
const Job = require("./job")(sequelize);
const Bid = require("./bid")(sequelize);
const Review = require("./review")(sequelize);

User.hasMany(Job, {
  foreignKey: "clientId",
  as: "jobsPosted"
});
Job.belongsTo(User, {
  foreignKey: {
    name: "clientId",
    allowNull: false
  },
  as: "client"
});

User.hasMany(Bid, {
  foreignKey: "freelancerId",
  as: "bids"
});
Bid.belongsTo(User, {
  foreignKey: {
    name: "freelancerId",
    allowNull: false
  },
  as: "freelancer"
});

Job.hasMany(Bid, {
  foreignKey: "jobId",
  as: "bids"
});
Bid.belongsTo(Job, {
  foreignKey: {
    name: "jobId",
    allowNull: false
  },
  as: "job"
});

Job.hasMany(Review, {
  foreignKey: "jobId",
  as: "reviews"
});
Review.belongsTo(Job, {
  foreignKey: {
    name: "jobId",
    allowNull: false
  },
  as: "job"
});

User.hasMany(Review, {
  foreignKey: "reviewerId",
  as: "reviewsWritten"
});
Review.belongsTo(User, {
  foreignKey: {
    name: "reviewerId",
    allowNull: false
  },
  as: "reviewer"
});

User.hasMany(Review, {
  foreignKey: "revieweeId",
  as: "reviewsReceived"
});
Review.belongsTo(User, {
  foreignKey: {
    name: "revieweeId",
    allowNull: false
  },
  as: "reviewee"
});

module.exports = {
  sequelize,
  User,
  Job,
  Bid,
  Review
};

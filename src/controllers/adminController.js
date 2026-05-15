const asyncHandler = require("../utils/asyncHandler");
const { Bid, Job, User } = require("../models");

const getPlatformStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalJobs, totalBids] = await Promise.all([
    User.count(),
    Job.count(),
    Bid.count()
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalJobs,
      totalBids
    }
  });
});

module.exports = {
  getPlatformStats
};

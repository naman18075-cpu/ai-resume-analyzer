const { fn, col } = require("sequelize");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { Review, Job, Bid, User } = require("../models");
const { JOB_STATUSES, USER_ROLES, BID_STATUSES } = require("../utils/constants");

const createReview = asyncHandler(async (req, res) => {
  const { jobId, revieweeId, rating, comment } = req.body;

  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.status !== JOB_STATUSES.COMPLETED) {
    throw new ApiError(400, "Reviews can only be created for completed jobs");
  }

  const acceptedBid = await Bid.findOne({
    where: {
      jobId,
      status: BID_STATUSES.ACCEPTED
    }
  });

  if (!acceptedBid) {
    throw new ApiError(400, "A completed job must have an accepted bid");
  }

  const reviewerId = req.user.id;
  const clientId = job.clientId;
  const freelancerId = acceptedBid.freelancerId;

  const isClientReviewer = reviewerId === clientId;
  const isFreelancerReviewer = reviewerId === freelancerId;

  if (!isClientReviewer && !isFreelancerReviewer) {
    throw new ApiError(403, "Only participants in the job can leave a review");
  }

  if (reviewerId === revieweeId) {
    throw new ApiError(400, "You cannot review yourself");
  }

  if (isClientReviewer && revieweeId !== freelancerId) {
    throw new ApiError(400, "Clients can only review the accepted freelancer");
  }

  if (isFreelancerReviewer && revieweeId !== clientId) {
    throw new ApiError(400, "Freelancers can only review the job client");
  }

  const review = await Review.create({
    jobId,
    reviewerId,
    revieweeId,
    rating,
    comment
  });

  const reviewee = await User.findByPk(revieweeId);

  if (reviewee.role === USER_ROLES.FREELANCER) {
    const [result] = await Review.findAll({
      where: { revieweeId },
      attributes: [[fn("AVG", col("rating")), "averageRating"]],
      raw: true
    });

    await reviewee.update({
      rating: Number(Number(result.averageRating || 0).toFixed(2))
    });
  }

  res.status(201).json({
    success: true,
    data: review
  });
});

module.exports = {
  createReview
};

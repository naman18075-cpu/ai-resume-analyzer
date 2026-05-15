const { Op } = require("sequelize");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { buildPaginationMeta, getPagination } = require("../utils/pagination");
const { getActiveBidsCount } = require("../utils/bidUtils");
const { Bid, Job, User, sequelize } = require("../models");
const { BID_STATUSES, JOB_STATUSES, MAX_ACTIVE_BIDS } = require("../utils/constants");

const createBid = asyncHandler(async (req, res) => {
  const { jobId, price, proposalText, estimatedTime, matchScore = 0 } = req.body;

  const job = await Job.findByPk(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.status !== JOB_STATUSES.OPEN) {
    throw new ApiError(400, "Bids can only be placed on open jobs");
  }

  const existingBid = await Bid.findOne({
    where: {
      jobId,
      freelancerId: req.user.id
    }
  });

  if (existingBid) {
    throw new ApiError(409, "You have already placed a bid on this job");
  }

  const activeBidsCount = await getActiveBidsCount(req.user.id);

  if (activeBidsCount >= MAX_ACTIVE_BIDS) {
    throw new ApiError(400, `Freelancers can only keep ${MAX_ACTIVE_BIDS} active bids`);
  }

  const bid = await Bid.create({
    jobId,
    freelancerId: req.user.id,
    price,
    proposalText,
    estimatedTime,
    matchScore
  });

  res.status(201).json({
    success: true,
    data: {
      ...bid.get({ plain: true }),
      activeBidsCount: activeBidsCount + 1
    }
  });
});

const getBidsForJob = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const job = await Job.findByPk(req.params.jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.clientId !== req.user.id) {
    throw new ApiError(403, "You can only view bids for your own jobs");
  }

  const { rows, count } = await Bid.findAndCountAll({
    where: {
      jobId: job.id
    },
    include: [
      {
        model: User,
        as: "freelancer",
        attributes: ["id", "name", "city", "rating", "completedJobs", "isVerified"]
      }
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });

  res.json({
    success: true,
    data: rows,
    pagination: buildPaginationMeta(page, limit, count)
  });
});

const getMyBids = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);

  const { rows, count } = await Bid.findAndCountAll({
    where: {
      freelancerId: req.user.id
    },
    include: [
      {
        model: Job,
        as: "job",
        include: [
          {
            model: User,
            as: "client",
            attributes: ["id", "name", "city", "isVerified"]
          }
        ]
      }
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });

  res.json({
    success: true,
    data: rows,
    activeBidsCount: await getActiveBidsCount(req.user.id),
    pagination: buildPaginationMeta(page, limit, count)
  });
});

const acceptBid = asyncHandler(async (req, res) => {
  const bid = await Bid.findByPk(req.params.id, {
    include: [
      {
        model: Job,
        as: "job"
      }
    ]
  });

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  if (bid.job.clientId !== req.user.id) {
    throw new ApiError(403, "You can only accept bids on your own jobs");
  }

  if (bid.job.status !== JOB_STATUSES.OPEN) {
    throw new ApiError(400, "Only open jobs can accept a bid");
  }

  if (bid.status !== BID_STATUSES.PENDING) {
    throw new ApiError(400, "Only pending bids can be accepted");
  }

  await sequelize.transaction(async (transaction) => {
    await bid.update(
      { status: BID_STATUSES.ACCEPTED },
      { transaction }
    );

    await Bid.update(
      { status: BID_STATUSES.REJECTED },
      {
        where: {
          jobId: bid.jobId,
          id: {
            [Op.ne]: bid.id
          }
        },
        transaction
      }
    );

    await bid.job.update(
      { status: JOB_STATUSES.IN_PROGRESS },
      { transaction }
    );
  });

  const updatedBid = await Bid.findByPk(bid.id, {
    include: [
      {
        model: Job,
        as: "job"
      }
    ]
  });

  res.json({
    success: true,
    message: "Bid accepted successfully",
    data: updatedBid
  });
});

const rejectBid = asyncHandler(async (req, res) => {
  const bid = await Bid.findByPk(req.params.id, {
    include: [
      {
        model: Job,
        as: "job"
      }
    ]
  });

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  if (bid.job.clientId !== req.user.id) {
    throw new ApiError(403, "You can only reject bids on your own jobs");
  }

  if (bid.status !== BID_STATUSES.PENDING) {
    throw new ApiError(400, "Only pending bids can be rejected");
  }

  await bid.update({
    status: BID_STATUSES.REJECTED
  });

  res.json({
    success: true,
    message: "Bid rejected successfully",
    data: bid
  });
});

module.exports = {
  createBid,
  getBidsForJob,
  getMyBids,
  acceptBid,
  rejectBid
};

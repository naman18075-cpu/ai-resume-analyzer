const { Op } = require("sequelize");
const env = require("../config/env");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { buildPaginationMeta, getPagination } = require("../utils/pagination");
const { Job, User, Bid, sequelize } = require("../models");
const { BID_STATUSES, JOB_STATUSES } = require("../utils/constants");

const createJob = asyncHandler(async (req, res) => {
  if (env.requireVerifiedClients && !req.user.isVerified) {
    throw new ApiError(403, "Only verified clients can post jobs");
  }

  const { title, description, budgetMin, budgetMax, deadline, skillsRequired, locationPreference } = req.body;

  if (Number(budgetMax) < Number(budgetMin)) {
    throw new ApiError(400, "budgetMax must be greater than or equal to budgetMin");
  }

  const job = await Job.create({
    title,
    description,
    budgetMin,
    budgetMax,
    deadline,
    skillsRequired,
    locationPreference,
    clientId: req.user.id
  });

  res.status(201).json({
    success: true,
    data: job
  });
});

const getJobs = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { minBudget, maxBudget, city, skill, status } = req.query;

  const where = {};

  if (minBudget) {
    where.budgetMin = { [Op.gte]: Number(minBudget) };
  }

  if (maxBudget) {
    where.budgetMax = { [Op.lte]: Number(maxBudget) };
  }

  if (city) {
    where.locationPreference = {
      [Op.iLike]: `%${city}%`
    };
  }

  if (status) {
    where.status = status;
  }

  if (skill) {
    where.skillsRequired = {
      [Op.overlap]: [skill]
    };
  }

  const { rows, count } = await Job.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "client",
        attributes: ["id", "name", "city", "isVerified", "rating"]
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

const getSingleJob = asyncHandler(async (req, res) => {
  const job = await Job.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: "client",
        attributes: ["id", "name", "city", "isVerified", "rating"]
      },
      {
        model: Bid,
        as: "bids",
        required: false,
        where: { status: BID_STATUSES.ACCEPTED },
        separate: true,
        limit: 1,
        attributes: ["id", "freelancerId", "price", "estimatedTime", "status"]
      }
    ]
  });

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  res.json({
    success: true,
    data: job
  });
});

const getMyJobs = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);

  const { rows, count } = await Job.findAndCountAll({
    where: {
      clientId: req.user.id
    },
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

const getJobsByClient = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);

  const { rows, count } = await Job.findAndCountAll({
    where: {
      clientId: req.params.clientId
    },
    include: [
      {
        model: User,
        as: "client",
        attributes: ["id", "name", "city", "isVerified", "rating"]
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

const markJobCompleted = asyncHandler(async (req, res) => {
  const job = await Job.findByPk(req.params.id);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.clientId !== req.user.id) {
    throw new ApiError(403, "You can only complete your own jobs");
  }

  if (job.status !== JOB_STATUSES.IN_PROGRESS) {
    throw new ApiError(400, "Only jobs in progress can be marked as completed");
  }

  const acceptedBid = await Bid.findOne({
    where: {
      jobId: job.id,
      status: BID_STATUSES.ACCEPTED
    }
  });

  if (!acceptedBid) {
    throw new ApiError(400, "No accepted bid found for this job");
  }

  await sequelize.transaction(async (transaction) => {
    await job.update(
      { status: JOB_STATUSES.COMPLETED },
      { transaction }
    );

    await User.increment("completedJobs", {
      by: 1,
      where: { id: acceptedBid.freelancerId },
      transaction
    });
  });

  const updatedJob = await Job.findByPk(job.id);

  res.json({
    success: true,
    message: "Job marked as completed",
    data: updatedJob
  });
});

module.exports = {
  createJob,
  getJobs,
  getSingleJob,
  getMyJobs,
  getJobsByClient,
  markJobCompleted
};

const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { SavedJob, Job, User } = require("../models");
const { NOTIFICATION_TYPES } = require("../utils/constants");
const { createNotification } = require("../utils/notifications");

const saveJob = asyncHandler(async (req, res) => {
  const job = await Job.findByPk(req.body.jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const [savedJob, created] = await SavedJob.findOrCreate({
    where: {
      userId: req.user.id,
      jobId: req.body.jobId
    },
    defaults: {
      userId: req.user.id,
      jobId: req.body.jobId
    }
  });

  if (created) {
    await createNotification({
      recipientId: req.user.id,
      title: "Job saved",
      body: `You saved "${job.title}" for later review.`,
      type: NOTIFICATION_TYPES.JOB_BOOKMARKED,
      entityType: "Job",
      entityId: job.id
    });
  }

  res.status(created ? 201 : 200).json({
    success: true,
    data: savedJob
  });
});

const removeSavedJob = asyncHandler(async (req, res) => {
  const savedJob = await SavedJob.findOne({
    where: {
      userId: req.user.id,
      jobId: req.params.jobId
    }
  });

  if (!savedJob) {
    throw new ApiError(404, "Saved job not found");
  }

  await savedJob.destroy();

  res.json({
    success: true,
    message: "Saved job removed"
  });
});

const getSavedJobs = asyncHandler(async (req, res) => {
  const savedJobs = await SavedJob.findAll({
    where: {
      userId: req.user.id
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
    order: [["createdAt", "DESC"]]
  });

  res.json({
    success: true,
    data: savedJobs
  });
});

module.exports = {
  saveJob,
  removeSavedJob,
  getSavedJobs
};

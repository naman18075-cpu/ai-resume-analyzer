const { Op } = require("sequelize");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { Contract, Milestone, Job, User, Payment } = require("../models");
const { CONTRACT_STATUSES, MILESTONE_STATUSES, NOTIFICATION_TYPES, USER_ROLES } = require("../utils/constants");
const { createNotification } = require("../utils/notifications");

const getMyContracts = asyncHandler(async (req, res) => {
  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [{ clientId: req.user.id }, { freelancerId: req.user.id }]
    },
    include: [
      {
        model: Job,
        as: "job",
        attributes: ["id", "title", "status"]
      },
      {
        model: User,
        as: "client",
        attributes: ["id", "name", "email"]
      },
      {
        model: User,
        as: "freelancer",
        attributes: ["id", "name", "email"]
      },
      {
        model: Milestone,
        as: "milestones"
      }
    ],
    order: [["createdAt", "DESC"]]
  });

  res.json({
    success: true,
    data: contracts
  });
});

const getContractById = asyncHandler(async (req, res) => {
  const contract = await Contract.findByPk(req.params.id, {
    include: [
      {
        model: Job,
        as: "job"
      },
      {
        model: User,
        as: "client",
        attributes: ["id", "name", "email"]
      },
      {
        model: User,
        as: "freelancer",
        attributes: ["id", "name", "email"]
      },
      {
        model: Milestone,
        as: "milestones",
        include: [
          {
            model: Payment,
            as: "payments"
          }
        ]
      },
      {
        model: Payment,
        as: "payments"
      }
    ]
  });

  if (!contract) {
    throw new ApiError(404, "Contract not found");
  }

  if (![contract.clientId, contract.freelancerId].includes(req.user.id)) {
    throw new ApiError(403, "You do not have access to this contract");
  }

  res.json({
    success: true,
    data: contract
  });
});

const createMilestone = asyncHandler(async (req, res) => {
  const contract = await Contract.findByPk(req.params.id, {
    include: [
      {
        model: Milestone,
        as: "milestones"
      }
    ]
  });

  if (!contract) {
    throw new ApiError(404, "Contract not found");
  }

  if (contract.clientId !== req.user.id) {
    throw new ApiError(403, "Only the client can create milestones");
  }

  const sequence = contract.milestones.length + 1;
  const milestone = await Milestone.create({
    contractId: contract.id,
    title: req.body.title,
    description: req.body.description,
    amount: req.body.amount,
    dueDate: req.body.dueDate || null,
    sequence
  });

  await createNotification({
    recipientId: contract.freelancerId,
    title: "New milestone added",
    body: `A new milestone was added to contract "${contract.title}".`,
    type: NOTIFICATION_TYPES.MILESTONE_CREATED,
    entityType: "Milestone",
    entityId: milestone.id
  });

  res.status(201).json({
    success: true,
    data: milestone
  });
});

const submitMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findByPk(req.params.id, {
    include: [
      {
        model: Contract,
        as: "contract"
      }
    ]
  });

  if (!milestone) {
    throw new ApiError(404, "Milestone not found");
  }

  if (milestone.contract.freelancerId !== req.user.id) {
    throw new ApiError(403, "Only the assigned freelancer can submit this milestone");
  }

  if (![MILESTONE_STATUSES.FUNDED, MILESTONE_STATUSES.PENDING].includes(milestone.status)) {
    throw new ApiError(400, "This milestone cannot be submitted in its current state");
  }

  await milestone.update({
    status: MILESTONE_STATUSES.SUBMITTED
  });

  await createNotification({
    recipientId: milestone.contract.clientId,
    title: "Milestone submitted",
    body: `The freelancer submitted "${milestone.title}" for review.`,
    type: NOTIFICATION_TYPES.MILESTONE_SUBMITTED,
    entityType: "Milestone",
    entityId: milestone.id
  });

  res.json({
    success: true,
    data: milestone
  });
});

const approveMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findByPk(req.params.id, {
    include: [
      {
        model: Contract,
        as: "contract"
      }
    ]
  });

  if (!milestone) {
    throw new ApiError(404, "Milestone not found");
  }

  if (milestone.contract.clientId !== req.user.id) {
    throw new ApiError(403, "Only the client can approve a milestone");
  }

  if (milestone.status !== MILESTONE_STATUSES.SUBMITTED) {
    throw new ApiError(400, "Only submitted milestones can be approved");
  }

  await milestone.update({
    status: MILESTONE_STATUSES.APPROVED
  });

  res.json({
    success: true,
    data: milestone
  });
});

module.exports = {
  getMyContracts,
  getContractById,
  createMilestone,
  submitMilestone,
  approveMilestone
};

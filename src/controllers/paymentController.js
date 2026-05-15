const { Op } = require("sequelize");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { Payment, Milestone, Contract } = require("../models");
const { CONTRACT_STATUSES, MILESTONE_STATUSES, NOTIFICATION_TYPES, PAYMENT_STATUSES } = require("../utils/constants");
const { createNotification } = require("../utils/notifications");

const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.findAll({
    where: {
      [Op.or]: [{ payerId: req.user.id }, { payeeId: req.user.id }]
    },
    include: [
      {
        model: Contract,
        as: "contract"
      },
      {
        model: Milestone,
        as: "milestone"
      }
    ],
    order: [["createdAt", "DESC"]]
  });

  res.json({
    success: true,
    data: payments
  });
});

const fundMilestone = asyncHandler(async (req, res) => {
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
    throw new ApiError(403, "Only the client can fund this milestone");
  }

  if (milestone.status !== MILESTONE_STATUSES.PENDING) {
    throw new ApiError(400, "Only pending milestones can be funded");
  }

  const existingPayment = await Payment.findOne({
    where: {
      milestoneId: milestone.id,
      status: {
        [Op.in]: [PAYMENT_STATUSES.HELD, PAYMENT_STATUSES.RELEASED]
      }
    }
  });

  if (existingPayment) {
    throw new ApiError(409, "This milestone already has an active payment flow");
  }

  const payment = await Payment.create({
    contractId: milestone.contractId,
    milestoneId: milestone.id,
    payerId: milestone.contract.clientId,
    payeeId: milestone.contract.freelancerId,
    amount: milestone.amount,
    currency: req.body.currency || "INR",
    provider: req.body.provider || "MANUAL_ESCROW",
    transactionReference: req.body.transactionReference || null,
    notes: req.body.notes || "Manual escrow funding recorded for MVP demo.",
    status: PAYMENT_STATUSES.HELD
  });

  await milestone.update({
    status: MILESTONE_STATUSES.FUNDED
  });

  await createNotification({
    recipientId: milestone.contract.freelancerId,
    title: "Milestone funded",
    body: `Funds were reserved for "${milestone.title}".`,
    type: NOTIFICATION_TYPES.PAYMENT_FUNDED,
    entityType: "Payment",
    entityId: payment.id
  });

  res.status(201).json({
    success: true,
    data: payment
  });
});

const releaseMilestonePayment = asyncHandler(async (req, res) => {
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
    throw new ApiError(403, "Only the client can release milestone payments");
  }

  if (milestone.status !== MILESTONE_STATUSES.APPROVED) {
    throw new ApiError(400, "Only approved milestones can be released");
  }

  const payment = await Payment.findOne({
    where: {
      milestoneId: milestone.id,
      status: PAYMENT_STATUSES.HELD
    }
  });

  if (!payment) {
    throw new ApiError(404, "Held payment not found for this milestone");
  }

  await payment.update({
    status: PAYMENT_STATUSES.RELEASED
  });

  await milestone.update({
    status: MILESTONE_STATUSES.RELEASED
  });

  const remainingMilestones = await Milestone.count({
    where: {
      contractId: milestone.contractId,
      status: {
        [Op.ne]: MILESTONE_STATUSES.RELEASED
      }
    }
  });

  if (remainingMilestones === 0) {
    await milestone.contract.update({
      status: CONTRACT_STATUSES.COMPLETED
    });
  }

  await createNotification({
    recipientId: milestone.contract.freelancerId,
    title: "Payment released",
    body: `Payment for "${milestone.title}" was released.`,
    type: NOTIFICATION_TYPES.PAYMENT_RELEASED,
    entityType: "Payment",
    entityId: payment.id
  });

  res.json({
    success: true,
    data: payment
  });
});

module.exports = {
  getMyPayments,
  fundMilestone,
  releaseMilestonePayment
};

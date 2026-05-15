const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { KycVerification, FileAsset, User } = require("../models");
const { KYC_STATUSES, NOTIFICATION_TYPES } = require("../utils/constants");
const { createNotification } = require("../utils/notifications");

const submitKyc = asyncHandler(async (req, res) => {
  const { panNumber, fullName, age, legalAddress, notes, documentFileId } = req.body;

  if (documentFileId) {
    const file = await FileAsset.findOne({
      where: {
        id: documentFileId,
        ownerId: req.user.id
      }
    });

    if (!file) {
      throw new ApiError(404, "Supporting document file not found");
    }
  }

  const existingRecord = await KycVerification.findOne({
    where: { userId: req.user.id }
  });

  const payload = {
    userId: req.user.id,
    panNumber: panNumber.toUpperCase(),
    fullName,
    age,
    legalAddress,
    notes,
    documentFileId: documentFileId || null,
    status: KYC_STATUSES.UNDER_REVIEW,
    rejectionReason: null,
    submittedAt: new Date(),
    reviewedAt: null,
    reviewerId: null
  };

  const record = existingRecord
    ? await existingRecord.update(payload)
    : await KycVerification.create(payload);

  await User.update(
    {
      age
    },
    {
      where: { id: req.user.id }
    }
  );

  await createNotification({
    recipientId: req.user.id,
    title: "KYC submitted",
    body: "Your PAN verification request is now under review.",
    type: NOTIFICATION_TYPES.KYC_SUBMITTED,
    entityType: "KycVerification",
    entityId: record.id
  });

  res.status(201).json({
    success: true,
    data: record
  });
});

const getMyKyc = asyncHandler(async (req, res) => {
  const record = await KycVerification.findOne({
    where: { userId: req.user.id },
    include: [
      {
        model: FileAsset,
        as: "documentFile"
      }
    ]
  });

  res.json({
    success: true,
    data: record
  });
});

const reviewKyc = asyncHandler(async (req, res) => {
  const { status, rejectionReason = null } = req.body;
  const record = await KycVerification.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: "user"
      }
    ]
  });

  if (!record) {
    throw new ApiError(404, "KYC record not found");
  }

  await record.update({
    status,
    rejectionReason,
    reviewedAt: new Date(),
    reviewerId: req.user.id
  });

  await record.user.update({
    isVerified: status === KYC_STATUSES.APPROVED,
    age: record.age
  });

  await createNotification({
    recipientId: record.userId,
    title: status === KYC_STATUSES.APPROVED ? "KYC approved" : "KYC rejected",
    body:
      status === KYC_STATUSES.APPROVED
        ? "Your account is now verified and ready for higher trust actions."
        : rejectionReason || "Your verification was rejected. Please review and resubmit.",
    type:
      status === KYC_STATUSES.APPROVED
        ? NOTIFICATION_TYPES.KYC_APPROVED
        : NOTIFICATION_TYPES.KYC_REJECTED,
    entityType: "KycVerification",
    entityId: record.id
  });

  res.json({
    success: true,
    data: record
  });
});

module.exports = {
  submitKyc,
  getMyKyc,
  reviewKyc
};

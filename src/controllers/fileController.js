const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { FileAsset } = require("../models");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const { saveBase64File } = require("../utils/fileStorage");

const uploadFile = asyncHandler(async (req, res) => {
  const { fileName, mimeType, base64Data, category, entityType, entityId } = req.body;

  if (!base64Data) {
    throw new ApiError(400, "base64Data is required");
  }

  const savedFile = saveBase64File({
    fileName,
    base64Data
  });

  const fileAsset = await FileAsset.create({
    ownerId: req.user.id,
    originalName: fileName,
    storedName: savedFile.storedName,
    mimeType,
    fileSize: savedFile.fileSize,
    relativePath: savedFile.relativePath,
    publicUrl: `/${savedFile.relativePath.replace(/\\/g, "/")}`,
    category,
    entityType: entityType || null,
    entityId: entityId || null
  });

  res.status(201).json({
    success: true,
    data: fileAsset
  });
});

const getMyFiles = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { rows, count } = await FileAsset.findAndCountAll({
    where: {
      ownerId: req.user.id
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

module.exports = {
  uploadFile,
  getMyFiles
};

const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { PortfolioItem, User } = require("../models");

const getMyPortfolio = asyncHandler(async (req, res) => {
  const items = await PortfolioItem.findAll({
    where: {
      freelancerId: req.user.id
    },
    order: [["isFeatured", "DESC"], ["createdAt", "DESC"]]
  });

  res.json({
    success: true,
    data: items
  });
});

const getFreelancerPortfolio = asyncHandler(async (req, res) => {
  const freelancer = await User.findByPk(req.params.freelancerId);

  if (!freelancer) {
    throw new ApiError(404, "Freelancer not found");
  }

  const items = await PortfolioItem.findAll({
    where: {
      freelancerId: req.params.freelancerId
    },
    order: [["isFeatured", "DESC"], ["createdAt", "DESC"]]
  });

  res.json({
    success: true,
    data: {
      freelancer,
      items
    }
  });
});

const createPortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.create({
    ...req.body,
    freelancerId: req.user.id
  });

  res.status(201).json({
    success: true,
    data: item
  });
});

const updatePortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.findOne({
    where: {
      id: req.params.id,
      freelancerId: req.user.id
    }
  });

  if (!item) {
    throw new ApiError(404, "Portfolio item not found");
  }

  await item.update(req.body);

  res.json({
    success: true,
    data: item
  });
});

const deletePortfolioItem = asyncHandler(async (req, res) => {
  const item = await PortfolioItem.findOne({
    where: {
      id: req.params.id,
      freelancerId: req.user.id
    }
  });

  if (!item) {
    throw new ApiError(404, "Portfolio item not found");
  }

  await item.destroy();

  res.json({
    success: true,
    message: "Portfolio item deleted"
  });
});

module.exports = {
  getMyPortfolio,
  getFreelancerPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
};

const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { generateToken } = require("../utils/auth");
const { getActiveBidsCount } = require("../utils/bidUtils");
const { User } = require("../models");
const { USER_ROLES } = require("../utils/constants");

const sanitizeUser = async (user) => {
  const plainUser = user.get({ plain: true });

  if (plainUser.role === USER_ROLES.FREELANCER) {
    plainUser.activeBidsCount = await getActiveBidsCount(plainUser.id);
  }

  return plainUser;
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, city, isVerified = false } = req.body;

  const existingUser = await User.findOne({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    city,
    isVerified
  });

  const token = generateToken({ id: user.id, role: user.role });

  res.status(201).json({
    success: true,
    token,
    data: await sanitizeUser(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.unscoped().findOne({
    where: { email: email.toLowerCase() }
  });

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken({ id: user.id, role: user.role });
  const safeUser = await User.findByPk(user.id);

  res.json({
    success: true,
    token,
    data: await sanitizeUser(safeUser)
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);

  res.json({
    success: true,
    data: await sanitizeUser(user)
  });
});

module.exports = {
  register,
  login,
  getCurrentUser
};

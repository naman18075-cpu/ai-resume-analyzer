const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { User } = require("../models");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is required");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new ApiError(401, "User linked to this token no longer exists");
  }

  req.user = user;
  next();
});

module.exports = {
  protect
};

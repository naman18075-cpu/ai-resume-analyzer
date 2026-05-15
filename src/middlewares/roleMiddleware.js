const env = require("../config/env");
const ApiError = require("../utils/apiError");

const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "You are not allowed to perform this action"));
  }

  return next();
};

const requireAdminAccess = (req, res, next) => {
  const email = req.user?.email?.toLowerCase();

  if (!email || !env.adminEmails.includes(email)) {
    return next(new ApiError(403, "Admin access denied"));
  }

  return next();
};

module.exports = {
  allowRoles,
  requireAdminAccess
};

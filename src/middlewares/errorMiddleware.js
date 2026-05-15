const { ValidationError, UniqueConstraintError } = require("sequelize");

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    return res.status(400).json({
      success: false,
      message: err.errors?.[0]?.message || "Database validation failed"
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error"
  });
};

module.exports = {
  notFound,
  errorHandler
};

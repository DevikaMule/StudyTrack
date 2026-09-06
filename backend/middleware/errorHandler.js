// Global error handler middleware

const errorHandler = (err, req, res, next) => {
  console.error("Error caught by middleware:", err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint Not Found - ${req.originalUrl}`
  });
};

module.exports = {
  errorHandler,
  notFound
};

/**
 * Error handler middleware
 */
module.exports = (error, req, res, next) => {
  res.status(400).json({
    error: error.message,
  })

  next()
}

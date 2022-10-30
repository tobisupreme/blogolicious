/**
 * Error handler middleware
 */
module.exports = (error, req, res, next) => {
  if (error.message === 'data and hash arguments required') {
    return res.status(403).json({
      error: 'please provide password',
    })
  }

  if (error.source === 'jwt middleware error') {
    return res.status(403).json({
      status: false,
      error: 'invalid token',
    })
  }

  res.status(400).json({
    error: error.message,
  })

  next()
}

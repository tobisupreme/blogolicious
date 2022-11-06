const logger = require('../utils/logger')

/**
 * Error handler middleware
 */
module.exports = (error, req, res, next) => {
  logger.error(error)

  if (error.message === 'data and hash arguments required') {
    return res.status(403).json({
      error: 'please provide password',
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      error: 'token expired'
    })
  }

  if (error.source === 'jwt middleware error') {
    return res.status(403).json({
      status: 'fail',
      error: 'invalid token',
    })
  }

  if (error.source === 'creating a blog') {
    return res.status(400).json({
      status: 'fail',
      error: 'Please provide valid details',
      additionalInfo: error,
    })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      status: 'fail',
      error: 'malformatted id'
    })
  }

  res.status(400).json({
    status: 'fail',
    error: error.message,
  })

  next()
}

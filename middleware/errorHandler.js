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

  if (error.source === 'creating a blog') {
    return res.status(400).json({
      status: 'fail',
      error: 'Please provide valid details',
      additionalInfo: error,
    })
  }

  res.status(400).json({
    error: error.message,
  })

  next()
}

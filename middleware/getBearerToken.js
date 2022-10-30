module.exports = (req, res, next) => {
  try {
    const authorization = req.get('authorization')

    if (!(authorization && authorization.toLowerCase().startsWith('bearer'))) {
      return res.status(400).json({
        error: 'invalid token',
      })
    }

    // if signing in with bearer token
    req.token = authorization.substring(7)
    next()
  } catch (err) {
    next(err)
  }
}

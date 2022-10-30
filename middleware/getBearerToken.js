module.exports = (req, res, next) => {
  try {
    const authorization = req.get('authorization')

    if (!(authorization && authorization.toLowerCase().startsWith('bearer'))) {
      throw new Error()
    }

    // if signing in with bearer token
    req.token = authorization.substring(7)
    next()
  } catch (err) {
    err.source = 'jwt middleware error'
    next(err)
  }
}

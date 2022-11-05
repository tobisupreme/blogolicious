const User = require('../models/User')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
    // get bearer token from header
    const authorization = req.get('authorization')
    if (!(authorization && authorization.toLowerCase().startsWith('bearer'))) {
      throw new Error()
    }
    const bearerToken = authorization.substring(7)

    // decode bearer token
    const userFromToken = jwt.verify(bearerToken, process.env.SECRET)
    const user = await User.findById(userFromToken.id)
    if (!user) {
      throw new Error()
    }

    // add user to request object
    req.user = user
    next()
  } catch (err) {
    err.source = 'jwt middleware error'
    next(err)
  }
}

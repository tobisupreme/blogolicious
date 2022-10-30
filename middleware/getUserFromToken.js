const User = require('../models/User')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
    const userFromToken = jwt.verify(req.token, process.env.SECRET)
    const user = await User.findById(userFromToken.id)
    if (!user) {
      return res.status(403).json({
        error: 'invalid token'
      })
    }

    // add user to request object
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

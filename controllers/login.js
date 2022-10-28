const router = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/config')

router.route('/').post(async (req, res, next) => {
  try {
    // grab username and password from request
    const { username, password } = req.body
    // check database for user
    const user = await User.findOne({ username })
    const passwordIsValid = user === null ? false : await user.passwordIsValid(password)

    if (!(user && passwordIsValid)) {
      return res.status(403).json({
        message: 'Username/password is incorrect',
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const validityPeriod = '1h'
    const token = jwt.sign(userForToken, SECRET, { expiresIn: validityPeriod })

    res.json({ token, username: user.username, name: user.firstName })
  } catch (e) {
    next(e)
  }
})

module.exports = router

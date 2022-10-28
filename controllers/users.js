const User = require('../models/User')

const createUser = async (req, res, next) => {
  try {
    // grab details from the request
    const { firstName, lastName, username, email, password } = req.body
    // create user object
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password,
    })
    // save to database
    const createdUser = await newUser.save()
    // return response
    return res.status(201).json({
      status: true,
      data: createdUser,
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  createUser,
}

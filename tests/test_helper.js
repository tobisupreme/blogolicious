const User = require('../models/User')

const usersInDb = async() => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  usersInDb
}

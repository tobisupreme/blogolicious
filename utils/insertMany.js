const User = require('../models/User')
const Blog = require('../models/Article')
const helper = require('../tests/test_helper')

async function go() {
  console.log('starting..')
  await User.deleteMany({})
  await Blog.deleteMany({})

  console.log('inserting users..')
  const users = helper.initialUsers()
  for (let i = 0; i < users.length; i++) {
    await User.create(users[i])
  }
  console.log('inserting users done..')

  console.log('inserting blogs..')
  const blogs = helper.initialArticles()
  for (let i = 0; i < 100; i++) {
    await Blog.create(blogs[i])
  }
  console.log('inserting blogs done..')
}

module.exports = go

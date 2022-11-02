const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
// const users = require('./list_of_users.json')
const blogs = require('./list_of_blogs.json')
// const User = require('../models/User')
const Blog = require('../models/Article')
const helper = require('./test_helper')

beforeEach(async () => {
  // console.log(Blogs.length)
  for (let i = 0; i < blogs.length; i++) {
    await Blog.create(blogs[i])
  }
})

describe('Creating a blog', () => {
  it('should return an error if no valid tokens are provided', async() => {
    const blogsBefore = await helper.articlesInDb()
    const response = await api
      .post('/api/blog')
      .send(helper.articleObject('Article by no registered user'))
      .expect(403)

    expect(response.body.status).toBe(false)

    const blogsAfter = await helper.articlesInDb()
    expect(blogsBefore.length).toBe(blogsAfter.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})

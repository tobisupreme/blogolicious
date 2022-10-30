const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/User')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})
  for (let i = 5; i > 0; i--) {
    await User.create(helper.createUserObject(i))
  }
})

describe('Creating a blog', () => {
  let token

  const login = async (username) => {
    const response = await api
      .post('/api/login')
      .send({
        username,
        password: 'Password0!',
      })

    token = response.body
  }

  it('should work with valid token', async () => {
    const user = 'user3'
    await login(user)

    const blogsBefore = await helper.articlesInDb()

    const response = await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send(helper.articleObject(`Article by ${user}`))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.data).toHaveProperty('title')
    expect(response.body.data).toHaveProperty('description')
    expect(response.body.data).toHaveProperty('tags')
    expect(response.body.data).toHaveProperty('author')
    expect(response.body.data).toHaveProperty('createdAt')
    expect(response.body.data).toHaveProperty('updatedAt')
    expect(response.body.data).toHaveProperty('read_count')
    expect(response.body.data).toHaveProperty('reading_time')
    expect(response.body.data).toHaveProperty('body')
    expect(response.body.data).toHaveProperty('state')
    expect(response.body.data.state).toBe('draft')

    const blogsAfter = await helper.articlesInDb()
    expect(blogsBefore.length).toBe(blogsAfter.length - 1)

  })

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

const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/User')
const Blog = require('../models/Article')
const helper = require('./test_helper')

let token

const login = async (username) => {
  const response = await api.post('/api/login').send({
    username,
    password: 'Password0!',
  })

  token = response.body
}

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const users = helper.initialUsers()
  for (let i = 0; i < users.length; i++) {
    await User.create(users[i])
  }

  const blogs = helper.initialArticles()
  for (let i = 0; i < 100; i++) {
    await Blog.create(blogs[i])
  }
})

describe('Creating a blog', () => {

  it('should work with valid token', async () => {
    const user = 'user3'
    await login(user)

    const blogsBefore = await helper.articlesInDb()

    const response = await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${token.token}`)
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

  it('should return an error if no valid tokens are provided', async () => {
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

describe('GET request to /api/blog when', () => {
  it('not logged in should be able to get a list of published blogs', async () => {
    const response = await api
      .get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogStates = response.body.data.map(blog => blog.state)
    expect(blogStates).not.toContain('draft')
    expect(response.body.data[0]).not.toHaveProperty('body')
  })

  it('logged in should be able to get a list of published blogs', async () => {
    const user = 'user1'
    await login(user)

    const response = await api
      .get('/api/blog')
      .set('Authorization', `Bearer ${token.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogStates = response.body.data.map(blog => blog.state)
    expect(blogStates).not.toContain('draft')
    expect(response.body.data[0]).not.toHaveProperty('body')
  })

  it('requested by ID should be able to get a published blog', async () => {
    const articlesAtStart = await helper.articlesInDb()

    const articleToView = articlesAtStart[0]

    const resultArticle = await api
      .get(`/api/blog/${articleToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedArticleToView = JSON.parse(JSON.stringify(articleToView))

    expect(resultArticle.body.data).toEqual(processedArticleToView)
  })
})

afterAll(async () => {
  mongoose.connection.close()
})

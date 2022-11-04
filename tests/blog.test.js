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

beforeAll(async () => {
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
    const response = await api.post('/api/blog').send(helper.articleObject('Article by no registered user')).expect(403)

    expect(response.body.status).toBe(false)

    const blogsAfter = await helper.articlesInDb()
    expect(blogsBefore.length).toBe(blogsAfter.length)
  })
})

describe('GET request to /api/blog/g', () => {
  const url = '/api/blog/g'
  it('when not logged in should be able to get a list of published blogs', async () => {
    const response = await api
      .get(url)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogStates = response.body.data.map((blog) => blog.state)
    expect(blogStates).not.toContain('draft')
    expect(response.body.data[0]).not.toHaveProperty('body')
  })

  it('when logged in should be able to get a list of published blogs', async () => {
    const user = 'user1'
    await login(user)

    const response = await api
      .get(url)
      .set('Authorization', `Bearer ${token.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogStates = response.body.data.map((blog) => blog.state)
    expect(blogStates).not.toContain('draft')
    expect(response.body.data[0]).not.toHaveProperty('body')
  })

  it('when requested by ID should be able to get a published blog', async () => {
    const articlesAtStart = await helper.articlesInDb()

    const articleToView = articlesAtStart[0]

    const resultArticle = await api
      .get(`${url}/${articleToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedArticleToView = JSON.parse(JSON.stringify(articleToView))

    expect(resultArticle.body.data.title).toEqual(processedArticleToView.title)
    expect(resultArticle.body.data.body).toEqual(processedArticleToView.body)
    expect(resultArticle.body.data.tags).toEqual(processedArticleToView.tags)
    expect(resultArticle.body.data._id).toEqual(processedArticleToView._id)
  })

  it('when requested by ID should return the author information', async () => {
    const articlesAtStart = await helper.articlesInDb()
    const users = await helper.usersInDb()
    const user1 = users[0]

    const articleToView = articlesAtStart[0]

    const resultArticle = await api
      .get(`${url}/${articleToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const authorOfArticle = resultArticle.body.data.author
    expect(authorOfArticle.username).toBe(user1.username)
    expect(authorOfArticle.id).toBe(user1.id)
  })

  it('when requested by ID should increase the read_count by 1', async () => {
    const articlesAtStart = await helper.articlesInDb()

    const articleToView = articlesAtStart[0]

    await api
      .get(`${url}/${articleToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const articlesAtMid = await helper.articlesInDb()
    const articleViewedAtMid = articlesAtMid[0]

    expect(articleViewedAtMid.read_count).toBe(articleToView.read_count + 1)

    await api
      .get(`${url}/${articleToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const articlesAtEnd = await helper.articlesInDb()
    const articleViewed = articlesAtEnd[0]

    expect(articleViewed.read_count).toBe(articleToView.read_count + 2)
  })

  it('returns a maximum of 20 blogs per page', async () => {
    const response = await api
      .get(url)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.data.length).toBe(20)
  })

  it('returns n blogs per page and a maximum of 20 blogs per page', async () => {
    let size = 9
    const response = await api
      .get(`${url}?size=${size}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.data.length).toBe(size)

    size = 90
    const response2 = await api
      .get(`${url}?size=${size}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response2.body.data.length).toBe(20)
  })

  it('returns blogs by a specific author', async () => {
    let author = 'user1'
    const response = await api
      .get(`${url}?author=${author}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const authorArray = response.body.data.map((blog) => blog.author.username)
    for (const blogAuthor of authorArray) {
      expect(blogAuthor).toBe(author)
    }

    author = 'user4'
    const response2 = await api
      .get(`${url}?author=${author}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const author2Array = response2.body.data.map((blog) => blog.author.username)
    for (const blogAuthor of author2Array) {
      expect(blogAuthor).toBe(author)
    }
  })

  it('returns a blog with a specific title', async () => {
    let title = 'at nam consequatur ea labore ea harum'
    const response = await api
      .get(`${url}?title=${title}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.data[0]._id).toBe('635f9d229a39346186b332cf')
    expect(response.body.data[0].title).toBe(title)
  })
})

/**
 * The owner of the blog should be able to get a list of their blogs.
 * The endpoint should be paginated
 * It should be filterable by state
 */
describe('The owner of the blog', () => {
  let user
  it('should be able to get a list of their blogs', async () => {
    user = 'user1'
    await login(user)

    const response = await api
      .get('/api/blog/p/')
      .set('Authorizaion', `Bearer ${token.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const authorArray = response.body.data.map((blog) => blog.author.username)
    for (const author of authorArray) {
      expect(author).toBe(user)
    }
  })

  it('should be able to get a list of their published blogs', async () => {
    const response = await api
      .get('/api/blog/p?state=published')
      .set('Authorizaion', `Bearer ${token.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const statesArray = response.body.data.map((blog) => blog.state)
    expect(statesArray).not.toContain('draft')
  })

  it('should be able to get a list of their blogs in draft state', async () => {
    const response = await api
      .get('/api/blog/p?state=draft')
      .set('Authorizaion', `Bearer ${token.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const statesArray = response.body.data.map((blog) => blog.state)
    expect(statesArray).not.toContain('published')
  })
})

afterAll(async () => {
  mongoose.connection.close()
})

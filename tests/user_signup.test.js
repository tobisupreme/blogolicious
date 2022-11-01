const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/User')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})
})

describe('check environment variables', () => {
  test('check that node environment is test', () => {
    expect(process.env.NODE_ENV).toBe('test')
  })
})

describe('post request to api/signup', () => {
  test('with correct details successfully creates a user', async () => {
    const newUser = {
      firstName: 'User',
      lastName: 'One',
      username: 'user1',
      email: 'user1@mail.com',
      password: 'password',
    }

    const usersInDbBefore = await helper.usersInDb()
    const response = await api
      .post('/api/signup')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersInDbAfter = await helper.usersInDb()
    expect(usersInDbBefore.length).toBe(usersInDbAfter.length - 1)

    expect(Object.keys(response.body.data)).not.toContain('password')
  })

  test('with incorrect details returns an error', async () => {
    const newUser = {
      firstName: 'User',
      lastName: 'One',
      username: 'user1',
      email: 'user1@mail.com',
    }

    const usersInDbBefore = await helper.usersInDb()
    await api
      .post('/api/signup')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersInDbAfter = await helper.usersInDb()
    expect(usersInDbBefore.length).toBe(usersInDbAfter.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})

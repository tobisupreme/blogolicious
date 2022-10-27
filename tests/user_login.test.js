const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/User')

beforeEach(async () => {
  await User.deleteMany({})
  await User.create({
    firstName: 'user',
    lastName: 'One',
    username: 'user1',
    email: 'user1@mail.com',
    password: 'Password0!',
  })
})

describe('POST request to /api/login', () => {
  test('is successful if user is registered in the database', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'user1',
        password: 'Password0!',
      })
      .expect(200)

    expect(response.body).toHaveProperty('token')
  })

  test('returns error if incorrect details are sent', async () => {
    const response = await api
      .post('/api/login')
      .send({
        username: 'user1',
      })
      .expect(403)

    expect(response.body).not.toHaveProperty('token')
  })
})

afterAll(() => {
  mongoose.connection.close()
})

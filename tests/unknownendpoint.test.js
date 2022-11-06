const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

test('requests to unknown endpoints should return a response with status code of 404', async () => {
  await api.get('/tobisupreme').expect(404)
  await api.post('/teamironmanvsteamcaptainamerica').expect(404)
  await api.put('/daniel/sodija').expect(404)
  await api.patch('/kanye-west').expect(404)
  await api.delete('/halle/berry').expect(404)
})

afterAll(() => {
  mongoose.connection.close()
})

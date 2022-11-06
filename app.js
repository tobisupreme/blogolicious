const CONFIG = require('./config/config')
const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const unknownEndpoint = require('./middleware/unknownEndpoint')
const signup = require('./routes/signup')
const login = require('./controllers/login')
const blog = require('./routes/blog')
const { requestLogger } = require('./utils/logger')

const app = express()

// connect to db
require('./middleware/db')(CONFIG.DBURI)

// parse information from request
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// use request logger
app.use(requestLogger)

// set info response
app.get('/', (req, res) => {
  res.json({
    status: 'status',
    message: 'Visit the link below for details about usage',
    link: 'https://github.com/tobisupreme/blogolicious#usage',
    readme: 'https://github.com/tobisupreme/blogolicious#readme',
  })
})

app.use('/api/signup', signup)
app.use('/api/login', login)
app.use('/api/blog', blog)

// use middleware for unknown endpoints
app.use(unknownEndpoint)

// use error handler middleware
app.use(errorHandler)

module.exports = app

const CONFIG = require('./config/config')
const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const signup = require('./routes/signup')

const app = express()

// connect to db
require('./middleware/db')(CONFIG.DBURI)

// parse information from request
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/signup', signup)

// use error handler middleware
app.use(errorHandler)

module.exports = app

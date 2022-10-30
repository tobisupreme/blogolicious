const router = require('express').Router()
const { createBlog } = require('../controllers/blogs')
const getBearerToken = require('../middleware/getBearerToken')
const getUserFromToken = require('../middleware/getUserFromToken')

// allow only requests with valid tokens
router.use(getBearerToken, getUserFromToken)
router.route('/').post(createBlog)

module.exports = router

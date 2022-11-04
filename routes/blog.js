const router = require('express').Router()
const { createBlog, getListOfBlogs, getPublishedBlog } = require('../controllers/blogs')
const apiFeatures = require('../middleware/apiFeatures')
const getBearerToken = require('../middleware/getBearerToken')
const getUserFromToken = require('../middleware/getUserFromToken')
const pagination = require('../middleware/pagination')

router.route('/g').get(apiFeatures.filterBy, apiFeatures.setPublished, pagination, getListOfBlogs)
router.route('/g/:id').get(getPublishedBlog)

// allow only requests with valid tokens
router.use(getBearerToken, getUserFromToken)
router.route('/').post(createBlog)

module.exports = router

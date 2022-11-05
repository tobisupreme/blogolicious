const router = require('express').Router()
const { createBlog, getListOfBlogs, getPublishedBlog } = require('../controllers/blogs')
const apiFeatures = require('../middleware/apiFeatures')
const getUserFromToken = require('../middleware/verifyUser')
const pagination = require('../middleware/pagination')

router.route('/g').get(apiFeatures.filterBy, apiFeatures.orderBy, apiFeatures.setPublished, pagination, getListOfBlogs)
router.route('/g/:id').get(getPublishedBlog)

// allow only requests with valid tokens
router.use(getUserFromToken)
router.route('/').post(createBlog)

module.exports = router

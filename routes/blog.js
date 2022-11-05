const router = require('express').Router()
const { createBlog, getBlogs, getBlog } = require('../controllers/blogs')
const { filterAndSort, filterByPublished, list } = require('../middleware/apiFeatures')
const getUserFromToken = require('../middleware/verifyUser')
const pagination = require('../middleware/pagination')

router.route('/').get(filterAndSort, filterByPublished, pagination, list, getBlogs)
router.route('/:id').get(getBlog)

// allow only requests with valid tokens
router.use(getUserFromToken)
router.route('/').post(createBlog)

module.exports = router

const router = require('express').Router()
const { createBlog, getBlogs, getBlog } = require('../controllers/blogs')
const { filterAndSort, filterByPublished, list, setUserFilter } = require('../middleware/apiFeatures')
const getUserFromToken = require('../middleware/verifyUser')
const pagination = require('../middleware/pagination')

router.route('/')
  .get(filterAndSort, filterByPublished, pagination, list, getBlogs)
  .post(getUserFromToken, createBlog)

router.route('/p')
  .get(getUserFromToken, filterAndSort, setUserFilter, pagination, getBlogs)

router.route('/:id').get(getBlog)

module.exports = router

const router = require('express').Router()
const blogController = require('../controllers/blogs')
const { filterAndSort, filterByPublished, list, setUserFilter } = require('../middleware/apiFeatures')
const { getUserFromToken, attachUser } = require('../middleware/verifyUser')
const pagination = require('../middleware/pagination')
const isCreator = require('../middleware/isCreator')

router.route('/')
  .get(filterAndSort, filterByPublished, pagination, list, blogController.getBlogs)
  .post(getUserFromToken, blogController.createBlog)

router.route('/p')
  .get(getUserFromToken, filterAndSort, setUserFilter, pagination, blogController.getBlogs)

router.route('/:id')
  .get(attachUser, blogController.getBlog)
  .patch(getUserFromToken, isCreator, blogController.updateBlogState)
  .put(getUserFromToken, isCreator, blogController.updateBlog)
  .delete(getUserFromToken, isCreator, blogController.deleteBlog)

module.exports = router

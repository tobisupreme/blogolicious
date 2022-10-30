const Blog = require('../models/Blog')

const createBlog = async (req, res, next) => {
  try {
    res.json({
      message: 'You are at /api/blog'
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  createBlog,
}

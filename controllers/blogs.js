const Blog = require('../models/Article')

const createBlog = async (req, res, next) => {
  try {
    // grab details from the request
    const { title, description, tags, body } = req.body
    // create blog object
    const newBlog = new Blog({
      title,
      description: description || title,
      tags,
      author: req.user._id,
      body,
    })
    // save to database
    const createdBlog = await newBlog.save()
    // return response
    return res.status(201).json({
      status: true,
      data: createdBlog,
    })
  } catch (e) {
    next(e)
  }
}

module.exports = {
  createBlog,
}

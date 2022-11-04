const Blog = require('../models/Article')
const { readingTime } = require('../utils/utils')

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
      reading_time: readingTime(body),
      owner: req.user.username,
    })
    // save to database
    const createdBlog = await newBlog.save()

    // save blog ID to user document
    req.user.articles = req.user.articles.concat(createdBlog._id)
    await req.user.save()

    // return response
    return res.status(201).json({
      status: true,
      data: createdBlog,
    })
  } catch (e) {
    next(e)
  }
}

const getListOfBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog
      .find(req.findFilter)
      .select({ title: 1, tags: 1 })
      .populate('author', { username: 1 })
      .skip(req.pagination.start)
      .limit(req.pagination.sizePerPage)

    const pageInfo = req.pageInfo

    return res.json({
      status: true,
      pageInfo,
      data: blogs,
    })
  } catch (err) {
    err.source = 'get published blogs controller'
    next(err)
  }
}

const getPublishedBlog = async (req, res, next) => {
  try {
    const { id } = req.params
    const blog = await Blog.findById(id)
      .populate('author', { username: 1 })

    if (blog.state !== 'published') {
      return res.status(403).json({
        status: false,
        error: 'Requested article is not published'
      })
    }

    // update blog read count
    blog.read_count += 1
    await blog.save()

    return res.json({
      status: true,
      data: blog
    })
  } catch (err) {
    err.source = 'get published blog controller'
    next(err)
  }
}

module.exports = {
  createBlog,
  getListOfBlogs,
  getPublishedBlog,
}

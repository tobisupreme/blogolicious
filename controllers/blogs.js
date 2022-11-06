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
      owner: req.user.username,
    })
    // save to database
    const createdBlog = await newBlog.save()

    // save blog ID to user document
    req.user.articles = req.user.articles.concat(createdBlog._id)
    await req.user.save()

    // return response
    return res.status(201).json({
      status: 'success',
      data: createdBlog,
    })
  } catch (err) {
    err.source = 'creating a blog'
    next(err)
  }
}

const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog
      .find(req.findFilter)
      .sort(req.sort)
      .select(req.fields)
      .populate('author', { username: 1 })
      .skip(req.pagination.start)
      .limit(req.pagination.sizePerPage)

    const pageInfo = req.pageInfo

    return res.json({
      status: 'success',
      pageInfo,
      data: blogs,
    })
  } catch (err) {
    err.source = 'get published blogs controller'
    next(err)
  }
}

const getBlog = async (req, res, next) => {
  try {
    const { id } = req.params
    const blog = await Blog.findById(id).populate('author', { username: 1 })

    if (!blog) {
      return res.status(404).json({
        status: 'fail',
        message: 'Blog not found'
      })
    }

    if (blog.state !== 'published') {
      const response = (res) => {
        return res.status(403).json({
          status: 'fail',
          error: 'Requested article is not published',
        })
      }
      if (!req.user) {
        return response(res)
      } else if (blog.author._id.toString() !== req.user.id.toString()) {
        return response(res)
      }
    }

    // update blog read count
    blog.read_count += 1
    await blog.save()

    return res.json({
      status: 'success',
      data: blog,
    })
  } catch (err) {
    err.source = 'get published blog controller'
    next(err)
  }
}

const updateBlogState = async (req, res, next) => {
  try {
    let { state } = req.body

    if (!(state && (state.toLowerCase() === 'published' || state.toLowerCase() === 'draft'))) {
      throw new Error('Please provide a valid state')
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, { state: state.toLowerCase() }, { new: true, runValidators: true, context: 'query' })

    if (!blog) {
      return res.status(404).json({
        status: 'fail',
        message: 'Blog not found'
      })
    }

    return res.json({
      status: 'success',
      data: blog
    })
  } catch (err) {
    err.source = 'update blog'
    next(err)
  }
}

const updateBlog = async (req, res, next) => {
  try {
    let blogUpdate = { ...req.body }

    if (blogUpdate.state) delete blogUpdate.state

    const blog = await Blog.findByIdAndUpdate(req.params.id, blogUpdate, { new: true, runValidators: true, context: 'query' })

    if (!blog) {
      return res.status(404).json({
        status: 'fail',
        message: 'Blog not found'
      })
    }

    return res.json({
      status: 'success',
      data: blog
    })
  } catch (err) {
    err.source = 'update blog'
    next(err)
  }
}

const deleteBlog = async (req, res, next) => {
  const user = req.user
  try {
    const deletedBlog = await Blog.findByIdAndRemove(req.params.id)

    if (!deletedBlog) {
      return res.status(404).json({
        status: 'fail',
        error: 'Blog not found'
      })
    }
    const deletedBlogId = deletedBlog._id
    const index = user.articles.indexOf(deletedBlogId)
    user.articles.splice(index, 1)

    await user.save()

    res.json({
      status: 'success',
      data: deletedBlog
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  updateBlogState,
  deleteBlog,
}

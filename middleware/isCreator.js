module.exports = async (req, res, next) => {
  try {
    const userArticles = req.user.articles.map(id => id.toString())
    const { id } = req.params
    const isPresent = userArticles.includes(id)

    if (!isPresent) {
      return res.status(403).json({
        status: 'fail',
        error: 'Forbidden'
      })
    }

    next()
  } catch (err) {
    err.source = 'jwt middleware error'
    next(err)
  }
}

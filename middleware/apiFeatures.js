const setPublished = (req, res, next) => {
  req.findFilter.state = 'published'
  next()
}

const filterBy = (req, res, next) => {
  const { author, title, tags, state } = req.query
  req.findFilter = {}
  if (author) req.findFilter.owner = author
  if (title) req.findFilter.title = title
  if (tags) {
    const tagAttributes = tags.split(',')
    req.findFilter.tags = { $in: tagAttributes }
  }
  if (state && ['draft', 'published'].includes(state)) req.findFilter.state = state
  next()
}

module.exports = {
  setPublished,
  filterBy,
}

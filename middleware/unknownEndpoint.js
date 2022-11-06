module.exports = (req, res, next) => {
  res.status(404).json({ status: 'fail', error: 'unknown endpoint' })
  next()
}

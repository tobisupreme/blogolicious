const info = (...params) => {
  if(process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  if(process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}
const requestLogger = (req, res, next) => {
  info('Method:', req.method)
  info('Path:  ', req.path)
  info('Body:  ', req.body)
  info('-----')
  next()
}

module.exports = {
  info,
  error,
  requestLogger,
}

require('dotenv').config()
const DBURI = process.env.NODE_ENV === 'test' ? process.env.TEST_DBURI : process.env.DBURI
const PORT = process.env.PORT

module.exports = {
  DBURI,
  PORT
}

require('dotenv').config()
const DBURI = process.env.NODE_ENV === 'test' ? process.env.TEST_DBURI : process.env.DBURI
const PORT = process.env.PORT
const SECRET = process.env.SECRET

module.exports = {
  DBURI,
  PORT,
  SECRET,
}

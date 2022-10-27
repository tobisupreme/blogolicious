const router = require('express').Router()
const { createUser } = require('../controllers/users')

router.route('/').post(createUser)

module.exports = router

const express = require('express')
const router = express.Router()
const register = require('../api/controllers/users/register')
const login = require('../api/controllers/users/login')
const guestlogin = require('../api/controllers/users/guestlogin')

router.post('/register', register)
router.post('/login', login)
router.post('/guest_login', guestlogin)

module.exports = router

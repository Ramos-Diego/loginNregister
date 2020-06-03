const express = require('express')
const router = express.Router()
const {
  notLoggedInProtection,
  loggedInProtection,
  loginUser,
  registerUser,
  logoutUser
} = require('../lib/authMiddleware')

// -------------- HOME ----------------
router.get('/', (req, res) => {
  res.render('index.ejs', {
    email: res.locals.user.email,
    loggedIn: res.locals.user._id
  })
})

// -------------- LOGIN ----------------
router.get('/login', loggedInProtection, (req, res) => {
  res.render('login.ejs', { flash: res.locals.flash })
})

router.post('/login', loggedInProtection, loginUser)

// -------------- REGISTER ----------------
router.get('/register', loggedInProtection, (req, res) => {
  res.render('register.ejs', { flash: res.locals.flash })
})

router.post('/register', loggedInProtection, registerUser)

// -------------- LOGOUT ----------------
router.get('/logout', notLoggedInProtection, logoutUser)

module.exports = router

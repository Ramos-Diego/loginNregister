const express = require('express')
const router = express.Router()
const {
  mustBeLoggedIn,
  mustNotBeLoggedIn,
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
router.get('/login', mustNotBeLoggedIn, (req, res) => {
  res.render('login.ejs', { flash: res.locals.flash })
})

router.post('/login', mustNotBeLoggedIn, loginUser)

// -------------- REGISTER ----------------
router.get('/register', mustNotBeLoggedIn, (req, res) => {
  res.render('register.ejs', { flash: res.locals.flash })
})

router.post('/register', mustNotBeLoggedIn, registerUser)

// -------------- LOGOUT ----------------
router.get('/logout', mustBeLoggedIn, logoutUser)

module.exports = router

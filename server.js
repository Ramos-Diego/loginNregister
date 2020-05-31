// Use local environment variable if not on production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express() // initialize express
const path = require('path') // for \ vs / OS paths
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// setup view engine
app.set('view engine', 'ejs')
// Body parser middleware, handle JSON
app.use(express.json())
// handle form submitions middleware
app.use(express.urlencoded({ extended: false }))
// Set a static folder
app.use(express.static(path.join(__dirname, 'public')))

// -------------- DATABASE ----------------
require('./config/database.js')

// EQUALS 2 HOURS = (1000 ms * 60 sec * 60 min * 2 hr)
const TWO_HOURS = 1000 * 60 * 60 * 2

// Configuration/Environment Variable
const {
  PORT = 3000, // TODO: Make sure setting PORT like this works in production
  NODE_ENV = 'development', // Default to development if it's not provided
  SESSION_LIFETIME = TWO_HOURS,
  SESSION_NAME = 'sid',
  SESSION_SECRET = 'aTINYsecret'
} = process.env

// if NODE_ENV in production, make session.cookie.secure = true
const IN_PRODUCTION = NODE_ENV === 'production'

// -------------- SESSIONS ----------------
// All the sessions will be saved in the 'sessions' collection
// of the database
app.use(session({
  name: SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions'
  }),
  cookie: {
    maxAge: SESSION_LIFETIME,
    sameSite: true,
    secure: IN_PRODUCTION
  }
}))

app.use((req, res, next) => {
  console.log(req.method, req.baseUrl, req.session)
  // res.locals is a special object is shared among the middlewares
  if (req.session.user) {
    res.locals.user = req.session.user
  } else {
    res.locals.user = {
      _id: null,
      email: null
    }
  }
  next()
})

// -------------- FLASH MESSAGES ----------------
// Custom flash middleware
app.use(/\/login|\/register/, (req, res, next) => {
  // If there's a flash message in the session request,
  // make it available in the response, then delete it.
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})

// Import and use routers
app.use('/', require('./routes/indexR'))

app.listen(PORT, console.log(`listening on ${PORT}`))

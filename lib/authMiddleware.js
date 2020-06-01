const User = require('../models/userSchema.js')
const { validatePassword, generateHash } = require('../lib/passwordTools')

// -------------- CUSTOM AUTHENTICATION ----------------
exports.notLoggedInProtection = (req, res, next) => {
  !res.locals.user._id ? res.redirect('/login') : next()
}

exports.loggedInProtection = (req, res, next) => {
  res.locals.user._id ? res.redirect('/') : next()
}

// -------------- LOGOUT USER ----------------
exports.logoutUser = (req, res, next) => {
  req.session.destroy(err => {
    if (err) { return res.redirect('/') }
    res.clearCookie('sid')
    res.redirect('/login')
  })
}

// -------------- FLASH MESSAGE FUNCTION ----------------
// TODO: Figure out why this doesn't work
// function redirectAndFlash (path, type, message) {
//   return function (req, res, next) {
//     req.session.flash = {
//       type: type,
//       email: email,
//       message: message
//     }
//     res.redirect(path)
//   }
// }

/*  -------------------------------------------------
    -------- DANGER ZONE (PASSWORD HAZARD) ----------
    ------------------------------------------------- */
exports.loginUser = (req, res, next) => {
  // -------------- FLASH MESSAGE FUNCTION ----------------
  const redirectAndFlash = (path, type, message) => {
    req.session.flash = {
      type: type,
      email: email,
      message: message
    }
    return res.redirect(path)
  }
  // Deconstruct the client form data
  const { email, password } = req.body

  // -------------- AUTHENTICATE LOGIN ----------------
  User.findOne({ email: email })
    .then((user) => {
      // If user is not found
      if (!user) { redirectAndFlash('/login', 'error', 'Email or password incorrect.') }
      // Password validation using custom function
      const isValid = validatePassword(password, user.hash, user.salt)
      // If password correct
      if (isValid) {
        // req.session._id = user._id
        req.session.user = {
          _id: user._id,
          email: user.email
        }
        // req.session.email = user.email
        return res.redirect('/')
      } else { redirectAndFlash('/login', 'error', 'Email or password incorrect.') }
    })
    .catch((err) => console.error(err))
}

exports.registerUser = async (req, res, next) => {
  // -------------- FLASH MESSAGE FUNCTION ----------------
  const redirectAndFlash = (path, type, message) => {
    req.session.flash = {
      type: type,
      email: email,
      message: message
    }
    return res.redirect(path)
  }
  // make all emails lowercase in the database to avoid duplicates
  const email = req.body.email.toLowerCase()

  try {
    // Check if email is already in the database
    const emailExists = await User.findOne({ email: email })
    // If the email is not in the database
    if (!emailExists) {
      // Create hashed password using custom function
      const newHash = generateHash(req.body.password)
      // Generate new User form the User schema
      const userS = new User({
        email: email,
        hash: newHash.hash,
        salt: newHash.salt
      })
      // Save user to database
      await userS.save()
      console.log('User account succesfully saved!')
      // Send the saved user to the client
      return redirectAndFlash('/login', 'success', 'You\'re registered. Login now!')
    } else {
      // Handle email already saved in the database
      // Set the flash message to be sent along with the redirect
      redirectAndFlash('/register', 'error', 'Email already registered.')
    }
  } catch (err) { console.error(err) }
}

/*  -------------------------------------------------
    ----- END OF DANGER ZONE (PASSWORD HAZARD) ------
    ------------------------------------------------- */

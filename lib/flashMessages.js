module.exports = {
  registrationError: {
    path: '/register',
    type: 'error',
    message: 'Email already registered.'
  },
  loginError: {
    path: '/login',
    type: 'error',
    message: 'Email or password incorrect.'
  },
  loginSuccess: {
    path: '/login',
    type: 'success',
    message: 'You\'re registered. Login now!'
  },
  verificationWarning: {
    path: '/login',
    type: 'warning',
    message: 'Please, enter the email verification code sent to your email.'
  }
}

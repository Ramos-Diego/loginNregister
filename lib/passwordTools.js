// Node.js cryptography library
const crypto = require('crypto')

exports.generateHash = (password) => {
  // Generate a salt string in hexadecimal
  const salt = crypto.randomBytes(32).toString('hex')
  // hash the password using the sha512 algorithm
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

  return {
    hash: hash,
    salt: salt
  }
}

exports.validatePassword = (password, hash, salt) => {
  // If the password passed by the client and the database salt
  // generate the same hash as in the database, user is authorized
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}

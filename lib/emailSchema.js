const mongoose = require('mongoose')

// Email Verification Schema
const emailVerificationSchema = mongoose.Schema({
  _id: { type: String, required: true },
  sessionActivity: { type: Date, expires: '1m', default: Date.now }, // Expire in 1 minute
  user_token: { type: Number, required: true }
})

// Create slug before saving article
// articleSchema.pre('validate', function (next) {
//   if (this.title) {
//     this.slug = slugify(this.title, { lower: true, strict: true })
//   }
// })

module.exports = mongoose.model('EmailVerification', emailVerificationSchema)

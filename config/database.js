const mongoose = require('mongoose')

// require('dotenv').config()

/**
 * -------------- DATABASE ----------------

 * Connect to MongoDB Server using the connection string
 * in the `.env` file. To implement this, place the following
 * string into the `.env` file
 *
 * MONGODB_DEV_URL=mongodb://<user>:<password>@localhost:27017/database_name
 * or
 * MONGODB_DEV_URL=mongodb://localhost/database_name
 * MONGODB_PROD_URL=<your production database string>
 */

// Declare mongoose options to avoid deprecation warnings
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}

// Connect to the correct environment database
if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_PROD_URL, mongoOptions)

  mongoose.connection.on('error', err => console.error(err))
  mongoose.connection.on('connected', () => {
    console.log('Connected to the production database.')
  })
} else {
  mongoose.connect(process.env.MONGODB_DEV_URL, mongoOptions)

  mongoose.connection.on('error', err => console.error(err))
  mongoose.connection.on('connected', () => {
    console.log('Connected to the development database.')
  })
}

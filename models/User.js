const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  articles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
    },
  ],
})

// encrypt password before saving document
UserSchema.pre('save', function (next) {
  let user = this

  // do nothing if the password is not modified
  if (!user.isModified('password')) return next()

  // hash the password using our new salt
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err)

    //override the clear text password with the hashed one
    user.password = hash
    next()
  })
})

// Compare user inputted password with password in the database
UserSchema.methods.passwordIsValid = function (password) {
  // get password from the database
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    // compare the password coming from the user with the hash password in the database
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }
      resolve(same)
    })
  })
}

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
    delete returnedObject.password
  },
})

module.exports = mongoose.model('User', UserSchema)

const crypto = require('crypto')

exports.generateSalt = () => {
  return crypto.randomBytes(128).toString('base64')
}

exports.generateHashedPassword = (salt, password) => {
  return crypto.createHmac('sha256', salt).update(password).digest('hex')
}

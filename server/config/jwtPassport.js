const jwt = require('jsonwebtoken')
const jwtVerifierFactory = require('../utilities/jwtVerifier')

const JWT_SECRET = process.env.JWT_SECRET

module.exports = cache => {
  const verifier = jwtVerifierFactory(cache)

  return (req, res, next) => {
    req.logIn = function logIn() {
      return new Promise((resolve, reject) => {
        let payload = this.user

        payload.session = Math.random()
          .toString(36)
          .slice(2)
        // add random element to payload so that
        // multiple logins wouldnt produce the same token
        // and consequently when user logs out one token, all others remain

        let token = jwt.sign(payload, JWT_SECRET)
        cache.set(token, '1', err => {
          if (err) {
            return reject(err)
          }
          resolve(token)
        })
      })
    }

    req.isAuthenticated = function isAuthenticated() {
      return verifier.exists(this).then(p => true, e => false)
      // returns true when promise resolves
      // and false when promise rejects
    }

    req.logOut = function logOut() {
      return verifier.delete(this)
    }

    next()
  }
}

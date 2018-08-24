const express = require('express')
const jwt = require('jsonwebtoken')

const jwtVerifierFactory = require('../utilities/jwtVerifier')
const toPlainObject = require('../utilities/toPlainObject')

const JWT_SECRET = process.env.JWT_SECRET

module.exports = (cache) => {
  const verifier = jwtVerifierFactory(cache)

  express.request.login = function login () {
    return new Promise((resolve, reject) => {
      let payload = toPlainObject(this.user)

      let token = jwt.sign(payload, JWT_SECRET)
      cache.set(token, '1', (err) => {
        if (err) {
          return reject(err)
        }
        resolve(token)
      })
    })
  }

  express.request.isAuthenticated = function isAuthenticated () {
    return verifier.exists(this)
      .then(p => true, e => false)
    // returns true when promise resolves
    // and false when promise rejects
  }

  express.request.logout = function logout () {
    return verifier.delete(this)
  }
}

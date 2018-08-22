const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
const INVALID_TOKEN = 'Invalid authentication token'

const ACTION_EXISTS = 'exists'
const ACTION_DELETE = 'del'

module.exports = cache => {
  let verifier = {}

  verifier.exists = (req) => verify(req, ACTION_EXISTS)
  verifier.delete = (req) => verify(req, ACTION_DELETE)

  return verifier

  function verify (req, action) {
    return new Promise((resolve, reject) => {
      try {
        let token = req.get('Authorization').split(' ')[1]
        let payload = jwt.verify(token, JWT_SECRET)

        cache[action](token, (err, res) => {
          if (err) {
            return reject(err)
          }

          if (res) resolve({ token, payload })
          else reject(new Error(INVALID_TOKEN))
        })
      } catch (e) {
        reject(INVALID_TOKEN)
      }
    })
  }
}

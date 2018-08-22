const jwtVerifierFactory = require('../utilities/jwtVerifier')

module.exports = cache => {
  const verifier = jwtVerifierFactory(cache)

  return async (req, res, next) => {
    try {
      let { token, payload } = await verifier.exists(req)

      req.token = token
      req.user = payload
    } catch (e) {
    } finally {
      next()
    }
  }
}

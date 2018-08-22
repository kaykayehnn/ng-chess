const FORBIDDEN = 403

exports.enforceAuthStatus = (shouldBeLoggedIn) => (req, res, next) => {
  let isLoggedIn = !!req.token
  if (isLoggedIn === shouldBeLoggedIn) {
    next()
  } else {
    res.sendStatus(FORBIDDEN)
  }
}

exports.isInRole = (role) => {
  return (req, res, next) => {
    let isLoggedIn = !!req.token
    if (isLoggedIn && req.user.roles.indexOf(role) > -1) {
      next()
    } else {
      res.sendStatus(FORBIDDEN)
    }
  }
}

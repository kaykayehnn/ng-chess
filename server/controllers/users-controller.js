const User = require('../models/User')
const Game = require('../models/Game')

const emailRgx = /^[^@]{2,}@(?:\w{2,}\.)+\w{2,}$/
const passwordRgx = /^.{8,}$/

exports.register = (req, res, next) => {
  let { email, password, repeatPassword } = req.body

  if (!emailRgx.test(email)) {
    return next(new Error('Invalid email'))
  }
  if (password !== repeatPassword) {
    return next(new Error("Passwords don't match"))
  }
  if (!passwordRgx.test(password)) {
    return next(new Error('Password must be at least 8 characters long'))
  }

  User.register(req.database)(email, password)
    .then(results => User.getById(req.database)(results.insertId))
    .then(user => {
      req.user = JSON.parse(JSON.stringify(user))
      return req.logIn()
    })
    .then(sendToken(res))
    .catch(next)
}

exports.login = (req, res, next) => {
  let { email, password } = req.body

  User.login(req.database)(email, password)
    .then(user => {
      req.user = user
      return req.logIn()
    })
    .then(sendToken(res))
    .catch(next)
}

exports.logout = (req, res, next) => {
  req
    .logout()
    .then(({ token }) => res.json({ token }))
    .catch(next)
}

exports.getStats = (req, res, next) => {
  let userId = +req.params.userId
  if (userId === req.user.id) {
    Game.getStats(req.database)(userId).then(rows => {
      if (rows.length === 0)
        return next(new Error(`User ${userId} does not exist`))

      res.json(rows[0])
    })
  } else next(new Error('You are not allowed to do that'))
}

exports.getMatches = (req, res, next) => {
  let userId = +req.params.userId
  let n = +req.query.n || 5

  if (userId === req.user.id) {
    Game.getLast(req.database)(userId, n).then(rows => {
      res.json(rows)
    })
  } else next(new Error('You are not allowed to do that'))
}

exports.getByEmail = (req, res, next) => {
  let { email } = req.query
  if (!emailRgx.test(email)) {
    return next(new Error('Invalid email format'))
  }

  User.getByEmail(req.database)(email)
    .then(usr => res.json(usr))
    .catch(next)
}

exports.getById = (req, res, next) => {
  let id = req.params.userId

  User.getById(req.database)(id)
    .then(user => res.json(user))
    .catch(next)
}

exports.getAllUsers = (req, res) => {
  User.getAll(req.database)().then(rows => res.json(rows))
}

exports.editUser = (req, res) => {
  let { userId } = req.params
  let { roles, avatarUrl } = req.body

  User.editById(req.database)(+userId, roles, avatarUrl).then(rows => {
    console.log(rows)
    res.json({})
  })
}

exports.deleteUser = (req, res, next) => {
  let { userId } = req.params

  User.deleteById(req.database)(+userId).then(() => res.json({}))
}

function sendToken(res) {
  return token => res.json({ token })
}

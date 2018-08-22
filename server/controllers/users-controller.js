const User = require('../models/User')

const emailRgx = /^[^@]{2,}@(?:\w{2,}\.)+\w{2,}$/
const passwordRgx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

exports.register = (req, res, next) => {
  let {
    email,
    password,
    repeatPassword
  } = req.body

  if (!emailRgx.test(email)) {
    return next(new Error('Invalid email'))
  }
  if (password !== repeatPassword) {
    return next(new Error('Passwords don\'t match'))
  }
  if (!passwordRgx.test(password)) {
    return next(new Error('Password must be at least 8 characters long and contain both a letter and a number'))
  }

  User.register(req.database)(email, password)
    .then(results => User.getById(req.database)(results.insertId))
    .then(user => {
      req.user = user
      return req.login()
    })
    .then(sendToken(res))
    .catch(next)
}

exports.login = (req, res, next) => {
  let {
    email,
    password
  } = req.body

  User.login(req.database)(email, password)
    .then(user => {
      req.user = user
      return req.login()
    })
    .then(sendToken(res))
    .catch(next)
}

exports.logout = (req, res, next) => {
  req.logout()
    .then(sendToken(res))
    .catch(next)
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
  User.getAllUsers()
    .lean()
    .then(users => {
      res.json(users)
    })
}

const invalidateArr = (arr) => !Array.isArray(arr) || arr.some(a => typeof a !== 'string')

exports.editUser = (req, res) => {
  let { userId } = req.params
  let { roles, favouriteTeams, avatarIx } = req.body

  if (invalidateArr(roles) || invalidateArr(favouriteTeams)) {
    return res.end()
  }

  User.findById(userId)
    .then(user => {
      if (!user) return res.end()

      user.roles = roles
      user.favouriteTeams = favouriteTeams
      user.avatarIx = avatarIx

      user.save()
        .then(() => res.json(user))
    })
}

exports.deleteUser = (req, res, next) => {
  let { userId } = req.params

  User.findByIdAndRemove(userId)
    .then(() => res.end())
    .catch(() => next(new Error(`User ${userId} doesn't exist`)))
}

function sendToken (res) {
  return token => res.json({ token })
}

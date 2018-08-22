const { generateSalt, generateHashedPassword } = require('../utilities/encryption')

const QUERIES = {
  REGISTER: `INSERT INTO users (email, salt, hashedPassword) VALUES (?, ?, ?)`,
  LOGIN: `SELECT
  *
  FROM users_stats us
  WHERE us.email = ?`,
  GET_BY_ID: `SELECT
  us.id,
  us.email,
  us.avatarUrl,
  us.roles
  FROM users_stats us
  WHERE us.id = ?`,
  GET_BY_EMAIL: `SELECT
  id
  FROM users_stats us
  WHERE us.email = ?`
}

exports.register = execQuery => function register (email, password) {
  let salt = generateSalt()
  let hashedPassword = generateHashedPassword(salt, password)

  return execQuery(QUERIES.REGISTER, [email, salt, hashedPassword])
}

exports.login = execQuery => function login (email, password) {
  return execQuery(QUERIES.LOGIN, [email])
    .then(rows => {
      let user = rows[0] || {}
      if (generateHashedPassword(user.salt, password) !== user.hashedPassword) {
        throw new Error('Invalid credentials')
      }

      return removeAuthProps(user)
    })
}

exports.getById = execQuery => function login (id) {
  return execQuery(QUERIES.GET_BY_ID, [id])
    .then(rows => {
      if (rows.length === 0) throw new Error(`User ${id} doesn't exist`)

      return rows[0]
    })
}

exports.getByEmail = execQuery => function getByEmail (email) {
  return execQuery(QUERIES.GET_BY_EMAIL, [email])
}

function removeAuthProps (user) {
  delete user.salt
  delete user.hashedPassword

  return user
}

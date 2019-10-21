module.exports = function bootstrap(server) {
  let env = process.env.NODE_ENV || 'development'
  if (env !== 'production') {
    const envPath = require('path').join(__dirname, '.env')
    require('dotenv').config({ path: envPath })
  }

  const app = require('express')()
  server = server || require('http').createServer(app)

  const cache = require('./config/cache')()
  const database = require('./config/database')()
  const jwtVerifier = require('./utilities/jwtVerifier')(cache)
  require('./websocket/')({ server, database, cache, jwtVerifier })
  require('./config/express')(app, database, cache)
  require('./config/routes')(app)

  return { app, server }
}

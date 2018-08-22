let env = process.env.NODE_ENV || 'development'
if (env !== 'production') {
  const envPath = require('path').join(__dirname, '.env')
  require('dotenv').config({ path: envPath })
}

const app = require('express')()
const server = require('http').createServer(app)

const cache = require('./config/cache')()
const database = require('./config/database')()
require('./websocket/')(server)
require('./config/express')(app, database, cache)
require('./config/routes')(app)
require('./config/jwtPassport')(cache)

let port = process.env.PORT

server.listen(port, () => console.log(`Server listening on port ${port}...`))

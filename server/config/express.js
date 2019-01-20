const express = require('express')
const path = require('path')
const morgan = require('morgan')
const compression = require('compression')
const cors = require('cors')

const decodeUser = require('../middleware/decodeUser')
const attachServices = require('../middleware/attachServices')

module.exports = (app, database, cache) => {
  app.use('/api', cors())
  app.use(compression())
  app.use(express.json())
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'))
  app.use(express.static(path.join(__dirname, '../../client/dist')))

  app.use(decodeUser(cache))
  app.use(attachServices({ database, cache }))
}

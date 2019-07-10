const express = require('express')
const path = require('path')
const morgan = require('morgan')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')

const decodeUser = require('../middleware/decodeUser')
const attachServices = require('../middleware/attachServices')

module.exports = (app, database, cache) => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: [
            "'self'",
            'ng-chess.herokuapp.com',
            'www.google-analytics.com'
          ],
          scriptSrc: [
            "'self'",
            'www.googletagmanager.com',
            // Gtag loads analytics from here
            'www.google-analytics.com'
          ],
          imgSrc: ['*'],
          styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
          fontSrc: ["'self'", 'fonts.gstatic.com'],
          // Analytics load 1x1px gifs for smaller requests.
          imgSrc: ["'self'", 'www.google-analytics.com']
        }
      }
    })
  )
  app.use('/api', cors({ origin: 'https://ng-chess.js.org' }))
  app.use(compression())
  app.use(express.json())
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'))
  app.use(express.static(path.join(__dirname, '../../client/dist')))

  app.use(decodeUser(cache))
  app.use(attachServices({ database, cache }))
}

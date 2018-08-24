const heartbeat = require('./heartbeat')

const middlewares = [heartbeat]

module.exports = function applyMiddleware (config, socket) {
  for (let i = 0; i < middlewares.length; i++) {
    middlewares[i].call(socket, config)
  }
}

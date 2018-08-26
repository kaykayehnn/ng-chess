const heartbeat = require('./heartbeat')
const attachSubscriber = require('./attachSubscriber')

const middlewares = [heartbeat, attachSubscriber]

module.exports = function applyMiddleware (config, socket) {
  for (let i = 0; i < middlewares.length; i++) {
    middlewares[i](config).call(socket)
  }
}

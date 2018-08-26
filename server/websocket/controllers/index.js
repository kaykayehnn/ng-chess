const rooms = require('./rooms')
const games = require('./games')

const controllers = [rooms, games]

module.exports = function applyControllers (config, socket) {
  for (let i = 0; i < controllers.length; i++) {
    controllers[i].call(socket, config)
  }
}

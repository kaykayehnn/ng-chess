const { EventEmitter } = require('events')

const INTERVAL = 30 * 1000

module.exports = function (socket) {
  let ee = new EventEmitter()

  let intervalId = setInterval(() => {
    socket.send('ping')
  }, INTERVAL)

  clearInterval(intervalId)
  // ee.on('disconnect')

  return ee
}

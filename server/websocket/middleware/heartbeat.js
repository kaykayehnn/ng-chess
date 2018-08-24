/* eslint-disable */
const { EventEmitter } = require('events')
const { RedisClient } = require('redis')
/* eslint-enable */

/**
 * @param {Object} config Configuration object
 * @param {EventEmitter} config.eventEmitter Used to communicate between event handlers
 * @param {RedisClient} config.cache Used for data persistence
 */
module.exports = function heartbeatMiddleware (config) {
  let isAlive = true

  let id = setInterval(() => {
    if (!isAlive) this.emit('close')

    isAlive = false
    this.ping(() => {
      isAlive = true
    })
  }, 30000)

  this.on('close', () => {
    clearInterval(id)
  })
}

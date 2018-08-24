// const a = require('redis').createClient()

const ROOMS = 'rooms'

module.exports = function roomController (config) {
  const { cache, jwtVerifier } = config
  const sub = config.cache.duplicate()
  let sendRoomsBound = sendRooms.bind(this)

  let subscribed = false
  let userRoom = null

  this.on(ROOMS, (payload) => {
    if (payload.event === 'subscribe' && !subscribed) {
      subscribed = true
      sub.subscribe(ROOMS)
      sub.on('message', (channel, message) => {
        sendRoomsBound()
      })
      sendRoomsBound()
    } else if (payload.event === 'add' && userRoom === null) {
      let { token, room } = payload // TODO: validate
      jwtVerifier.exists(token)
        .then(() => {
          let timestamp = +Date.now()
          userRoom = JSON.stringify(room)

          cache.zadd(ROOMS, timestamp, userRoom, (err, done) => {
            console.log(err || done)
            cache.publish(ROOMS, 'new room') // message is only for debugging purposes
          })
        })
        .catch(console.log)
    }
  })

  this.on('close', clearUp)

  function sendRooms () {
    cache.zrevrange(ROOMS, 0, -1, (err, rooms) => {
      if (err) return console.log(err)

      let message = JSON.stringify({ resource: ROOMS, payload: rooms })
      this.send(message)
    })
  }

  function clearUp () {
    if (userRoom) {
      cache.zrem(ROOMS, userRoom, (err, num) => {
        if (err) return console.log(err)
      })
    }
    sub.quit()
  }
}

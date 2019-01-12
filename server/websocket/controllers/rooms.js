const { createRoom, setWhitePlayer } = require('../../models/Game')

const ROOMS = 'rooms'
const NEW_ROOM = 'new room'
const REMOVED_ROOM = 'removed room'
const JOIN_ROOM = 'join room'

const joinRgx = /^join room:(.+):(\d+)$/
const noop = () => 0

exports = module.exports = function roomController (config) {
  const { database, cache, jwtVerifier } = config
  const sendRoomsBound = sendRooms.bind(this)
  const redirectToGameBound = redirectToGame.bind(this)

  let subscribed = false
  let self = null
  let userRoom = null
  let inGame = false

  this.sub.addListener('message', handleMessage)

  this.on(ROOMS, (message) => {
    if (message.event === 'subscribe' && !subscribed) {
      subscribed = true
      this.sub.subscribe(ROOMS)
      sendRoomsBound()
    } else if (message.event === 'unsubscribe' && subscribed) {
      subscribed = false // subscriptions use a shared client so
      // other subscriptions may be subscribed to the same channel
      // therefore toggling subscribe is enough
    } else if (message.event === 'add' && userRoom === null) {
      let { token } = message // TODO: validate
      jwtVerifier.exists(token)
        .then(({ payload: user }) => {
          let timestamp = +Date.now()
          let room = { host: user, timestamp }
          userRoom = JSON.stringify(room)
          self = user

          cache.zadd(ROOMS, timestamp, userRoom, (err, done) => {
            console.log(err || done)
            cache.publish(ROOMS, NEW_ROOM)
          })
        })
        .catch(console.log)
    } else if (message.event === 'remove' && userRoom !== null) {
      removeRoom()
    } else if (message.event === 'join' && !inGame) {
      let { token, room } = message // TODO: validate
      jwtVerifier.exists(token)
        .then(({ payload: user }) => {
          self = user

          createRoom(database)(user.id)
            .then(gameId => {
              redirectToGameBound(gameId)
              cache.publish(ROOMS, `${JOIN_ROOM}:${JSON.stringify(room)}:${gameId}`)
            })
        })
        .catch(console.log)
    }
  })

  this.on('close', () => {
    removeRoom()
    this.sub.removeListener('message', handleMessage)
  })

  function handleMessage (channel, message) {
    if (subscribed) {
      console.log(message)
      if (message === NEW_ROOM || message === REMOVED_ROOM) {
        sendRoomsBound()
      } else if (message.startsWith(JOIN_ROOM)) {
        let [, room, gameId] = joinRgx.exec(message) // first element is skipped deliberately

        if (room === userRoom) {
          setWhitePlayer(database)(gameId, self.id)
            .then(() => redirectToGameBound(gameId))
        }
      }
    }
  }

  function sendRooms () {
    cache.zrevrange(ROOMS, 0, -1, (err, rooms) => {
      if (err) return console.log(err)

      let message = JSON.stringify({ resource: ROOMS, payload: rooms })
      this.send(message)
    })
  }

  function redirectToGame (id) {
    removeRoom(() => {
      let message = {
        resource: 'game',
        payload: {
          event: 'join', gameId: id
        }
      }

      this.send(JSON.stringify(message))
    })
  }

  function removeRoom (cb) {
    if (typeof cb !== 'function') cb = noop

    if (userRoom) {
      cache.zrem(ROOMS, userRoom, (err, num) => {
        if (err) return console.log(err)

        userRoom = null
        cb()
        cache.publish(ROOMS, REMOVED_ROOM)
      })
    } else cb()
  }
}

// redis room key
exports.ROOMS = ROOMS

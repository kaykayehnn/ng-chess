const jwt = require('jsonwebtoken')
const Chess = require('chess.js').Chess
const { getById, endGame } = require('../../models/Game')

const JWT_SECRET = process.env.JWT_SECRET
const GAMES = 'games'
const DEFAULT_FEN = (new Chess()).fen()

const channelRgx = /^games:(\d+)$/
const moveRgx = /^move:(.+?):(.+)$/

module.exports = function gameController (config) {
  const { database, cache, jwtVerifier } = config
  const onMessageBound = onMessage.bind(this)

  let subscribed = null
  let playerToken = null

  this.sub.addListener('message', onMessageBound)
  this.on(GAMES, (message) => {
    const { token, gameId } = message
    playerToken = token
    if (typeof gameId !== 'number') return

    const gameChannel = `${GAMES}:${gameId}`
    if (message.event === 'subscribe') {
      subscribed = gameId
      this.sub.subscribe(gameChannel)
      cache.get(gameChannel, (_, val) => {
        let message = {
          resource: GAMES,
          payload: {
            event: 'subscribe',
            fen: val || ''
          }
        }

        this.send(JSON.stringify(message))
      })
    } else if (message.event === 'start') {
      jwtVerifier.exists(token)
        .then(({ payload: user }) => {
          let gamePromise = getById(database)(gameId)
          return Promise.all([user, gamePromise])
        })
        .then(([user, game]) => {
          game = game[0]
          if (game && game.winner == null) {
            let payload = { game }
            if (user.id === game.whitePlayerId) {
              payload.color = 'w'
            } else if (user.id === game.blackPlayerId) {
              payload.color = 'b'
            }
            cache.set(token, 1, () => 0)
            cache.setnx(gameChannel, DEFAULT_FEN, (err, set) => {
              if (err) return console.log(err)
              cache.get(gameChannel, (err, value) => {
                if (err) return console.log(err)

                payload.fen = value

                if (payload.color) {
                  let token = jwt.sign(payload, JWT_SECRET)
                  cache.set(token, 1)
                  let message = {
                    resource: GAMES,
                    payload: {
                      event: 'start',
                      token
                    }
                  }

                  this.sub.subscribe(gameChannel)
                  this.send(JSON.stringify(message))
                }
              })
            })
          }
        })
        .catch(console.log)
    } else if (message.event === 'move') {
      const { move } = message

      jwtVerifier.exists(token)
        .then(({ payload: player }) => {
          cache.get(gameChannel, (err, val) => {
            if (err) return console.log(err)

            let chess = new Chess(val)
            let valid = chess.move(move)
            if (valid) {
              let newFen = chess.fen()
              cache.set(gameChannel, newFen, (err, val) => {
                if (err) return console.log(err)

                cache.publish(gameChannel, `move:${move}:${token}`)
              })
              if (chess.in_checkmate()) {
                endGame(database)(gameId, valid.color, newFen)
              }
            }
          })
        })
    }
  })

  this.on('close', () => {
    this.sub.removeListener('message', onMessageBound)
  })

  function onMessage (channel, message) {
    if (!channel.startsWith(GAMES)) return

    let gameId = +channelRgx.exec(channel)[1]
    let [, move, token] = moveRgx.exec(message)
    if (token !== playerToken || token == null) {
      let message = {
        resource: GAMES,
        payload: {
          event: 'move',
          gameId,
          move
        }
      }

      this.send(JSON.stringify(message))
    }
  }
}
